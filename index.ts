#!/usr/bin/env node

import * as fs from 'node:fs'
import * as path from 'node:path'

import minimist from 'minimist'
import prompts from 'prompts'
import { red, green, bold } from 'kolorist'

import * as banners from './utils/banners'

import renderTemplate from './utils/renderTemplate'
import { postOrderDirectoryTraverse, preOrderDirectoryTraverse } from './utils/directoryTraverse'
import generateReadme from './utils/generateReadme'
import getCommand from './utils/getCommand'
import renderEslint from './utils/renderEslint'

function isValidPackageName(projectName) {
  return /^(?:@[a-z0-9-*~][a-z0-9-*._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/.test(projectName)
}

function toValidPackageName(projectName) {
  return projectName
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/^[._]/, '')
    .replace(/[^a-z0-9-~]+/g, '-')
}

function canSkipEmptying(dir: string) {
  if (!fs.existsSync(dir)) {
    return true
  }

  const files = fs.readdirSync(dir)
  if (files.length === 0) {
    return true
  }
  if (files.length === 1 && files[0] === '.git') {
    return true
  }

  return false
}

function emptyDir(dir) {
  if (!fs.existsSync(dir)) {
    return
  }

  postOrderDirectoryTraverse(
    dir,
    (dir) => fs.rmdirSync(dir),
    (file) => fs.unlinkSync(file)
  )
}

async function init() {
  console.log()
  console.log(
    process.stdout.isTTY && process.stdout.getColorDepth() > 8
      ? banners.gradientBanner
      : banners.defaultBanner
  )
  console.log()

  const cwd = process.cwd()
  // possible options:
  // --default
  // --typescript / --ts
  // --jsx
  // --router / --vue-router
  // --pinia
  // --with-tests / --tests (equals to `--vitest --cypress`)
  // --vitest
  // --cypress
  // --playwright
  // --eslint
  // --eslint-with-prettier (only support prettier through eslint for simplicity)
  // --force (for force overwriting)
  /**
   * process.argv 获取到的是一个数组，第一个元素是启动 Node.js 进程的可执行文件所在的绝对路径；
   * 第二个元素是当前所执行 js 文件的绝对路径；第三个及后边元素都是参数。
   */
  const argv = minimist(process.argv.slice(2), {
    alias: {
      typescript: ['ts'],
      'with-tests': ['tests'],
      router: ['vue-router']
    },
    string: ['_'],
    // all arguments are treated as booleans
    boolean: true
  })

  // if any of the feature flags is set, we would skip the feature prompts
  // 如果命令行中已经配置了，那么后面就将跳过后面用户选择的步骤
  const isFeatureFlagsUsed =
    typeof (
      argv.default ??
      argv.ts ??
      argv.jsx ??
      argv.router ??
      argv.pinia ??
      argv.tests ??
      argv.vitest ??
      argv.cypress ??
      argv.playwright ??
      argv.eslint
    ) === 'boolean'

  // 从命令行中尝试获取项目名称，不存在的话则采用默认项目名称。
  let targetDir = argv._[0]
  const defaultProjectName = !targetDir ? 'vue-project' : targetDir

  // forceOverwrite 变量来决定是否强制重写，清空目录。
  const forceOverwrite = argv.force

  // 用户配置
  let result: {
    projectName?: string
    shouldOverwrite?: boolean
    packageName?: string
    needsTypeScript?: boolean
    needsJsx?: boolean
    needsRouter?: boolean
    needsPinia?: boolean
    needsVitest?: boolean
    needsE2eTesting?: false | 'cypress' | 'playwright'
    needsEslint?: boolean
    needsPrettier?: boolean
  } = {
    needsTypeScript: true,
    needsJsx: true,
    needsRouter: true,
    needsPinia: true,
    needsVitest: false,
    needsE2eTesting: false,
    needsEslint: true,
    needsPrettier: true
  }

  let promptsResult: {
    promptsProjectName?: string
    promptsPackageName?: boolean
    promptsShouldOverwrite?: string
  } = {}

  try {
    // Prompts:
    // - Project name:
    //   - whether to overwrite the existing directory or not?
    //   - enter a valid package name for package.json
    // - Project language: JavaScript / TypeScript
    // - Add JSX Support?
    // - Install Vue Router for SPA development?
    // - Install Pinia for state management?
    // - Add Cypress for testing?
    // - Add Playwright for end-to-end testing?
    // - Add ESLint for code quality?
    // - Add Prettier for code formatting?

    // 通过 prompts 来和用户进行交互。
    // result = await prompts(
    //   [
    //     {
    //       name: 'projectName',
    //       type: targetDir ? null : 'text',
    //       message: 'Project name:',
    //       initial: defaultProjectName,
    //       onState: (state) => (targetDir = String(state.value).trim() || defaultProjectName)
    //     },
    //     {
    //       name: 'shouldOverwrite',
    //       type: () => (canSkipEmptying(targetDir) || forceOverwrite ? null : 'confirm'),
    //       message: () => {
    //         const dirForPrompt =
    //           targetDir === '.' ? 'Current directory' : `Target directory "${targetDir}"`

    //         return `${dirForPrompt} is not empty. Remove existing files and continue?`
    //       }
    //     },
    //     {
    //       name: 'overwriteChecker',
    //       type: (prev, values) => {
    //         if (values.shouldOverwrite === false) {
    //           throw new Error(red('✖') + ' Operation cancelled')
    //         }
    //         return null
    //       }
    //     },
    //     {
    //       name: 'packageName',
    //       type: () => (isValidPackageName(targetDir) ? null : 'text'),
    //       message: 'Package name:',
    //       initial: () => toValidPackageName(targetDir),
    //       validate: (dir) => isValidPackageName(dir) || 'Invalid package.json name'
    //     },
    //     {
    //       name: 'needsTypeScript',
    //       type: () => (isFeatureFlagsUsed ? null : 'toggle'),
    //       message: 'Add TypeScript?',
    //       initial: false,
    //       active: 'Yes',
    //       inactive: 'No'
    //     },
    //     {
    //       name: 'needsJsx',
    //       type: () => (isFeatureFlagsUsed ? null : 'toggle'),
    //       message: 'Add JSX Support?',
    //       initial: false,
    //       active: 'Yes',
    //       inactive: 'No'
    //     },
    //     {
    //       name: 'needsRouter',
    //       type: () => (isFeatureFlagsUsed ? null : 'toggle'),
    //       message: 'Add Vue Router for Single Page Application development?',
    //       initial: false,
    //       active: 'Yes',
    //       inactive: 'No'
    //     },
    //     {
    //       name: 'needsPinia',
    //       type: () => (isFeatureFlagsUsed ? null : 'toggle'),
    //       message: 'Add Pinia for state management?',
    //       initial: false,
    //       active: 'Yes',
    //       inactive: 'No'
    //     },
    //     {
    //       name: 'needsVitest',
    //       type: () => (isFeatureFlagsUsed ? null : 'toggle'),
    //       message: 'Add Vitest for Unit Testing?',
    //       initial: false,
    //       active: 'Yes',
    //       inactive: 'No'
    //     },
    //     {
    //       name: 'needsE2eTesting',
    //       type: () => (isFeatureFlagsUsed ? null : 'select'),
    //       message: 'Add an End-to-End Testing Solution?',
    //       initial: 0,
    //       choices: (prev, answers) => [
    //         { title: 'No', value: false },
    //         {
    //           title: 'Cypress',
    //           description: answers.needsVitest
    //             ? undefined
    //             : 'also supports unit testing with Cypress Component Testing',
    //           value: 'cypress'
    //         },
    //         {
    //           title: 'Playwright',
    //           value: 'playwright'
    //         }
    //       ]
    //     },
    //     {
    //       name: 'needsEslint',
    //       type: () => (isFeatureFlagsUsed ? null : 'toggle'),
    //       message: 'Add ESLint for code quality?',
    //       initial: false,
    //       active: 'Yes',
    //       inactive: 'No'
    //     },
    //     {
    //       name: 'needsPrettier',
    //       type: (prev, values) => {
    //         if (isFeatureFlagsUsed || !values.needsEslint) {
    //           return null
    //         }
    //         return 'toggle'
    //       },
    //       message: 'Add Prettier for code formatting?',
    //       initial: false,
    //       active: 'Yes',
    //       inactive: 'No'
    //     }
    //   ],
    //   {
    //     onCancel: () => {
    //       throw new Error(red('✖') + ' Operation cancelled')
    //     }
    //   }
    // )
    promptsResult = await prompts(
      [
        {
          name: 'promptsProjectName',
          type: targetDir ? null : 'text',
          message: 'Project name:',
          initial: defaultProjectName,
          onState: (state) => (targetDir = String(state.value).trim() || defaultProjectName)
        },
        {
          name: 'promptsShouldOverwrite',
          type: () => (canSkipEmptying(targetDir) || forceOverwrite ? null : 'confirm'),
          message: () => {
            const dirForPrompt =
              targetDir === '.' ? 'Current directory' : `Target directory "${targetDir}"`

            return `${dirForPrompt} is not empty. Remove existing files and continue?`
          }
        },
        {
          name: 'overwriteChecker',
          type: (prev, values) => {
            if (values.promptsShouldOverwrite === false) {
              throw new Error(red('✖') + ' Operation cancelled')
            }
            return null
          }
        },
        {
          name: 'promptsPackageName',
          type: () => (isValidPackageName(targetDir) ? null : 'text'),
          message: 'Package name:',
          initial: () => toValidPackageName(targetDir),
          validate: (dir) => isValidPackageName(dir) || 'Invalid package.json name'
        }
      ],
      {
        onCancel: () => {
          throw new Error(red('✖') + ' Operation cancelled')
        }
      }
    )
  } catch (cancelled) {
    console.log(cancelled.message)
    process.exit(1)
  }

  // 1. prompts 的配置中为什么会有两个 projectName 的配置，作用是什么?
  // 第一个的作用是当执行了 npm init vue@x 之后，提示给用户的一个默认名称
  // 第二个则是当用户输入项目名称之后触发的逻辑，会进行名称校验。

  // `initial` won't take effect if the prompt type is null
  // so we still have to assign the default values here

  // 后将上面命令行中获取的参数和用户选择的参数相结合存到对应的变量中。

  const {
    promptsProjectName,
    promptsPackageName = promptsProjectName ?? defaultProjectName,
    promptsShouldOverwrite = argv.force
  } = promptsResult

  result.projectName = promptsProjectName
  result.packageName = promptsProjectName ?? defaultProjectName
  result.shouldOverwrite = promptsShouldOverwrite

  const {
    projectName,
    packageName = projectName ?? defaultProjectName,
    shouldOverwrite = argv.force,
    needsJsx = argv.jsx,
    needsTypeScript = argv.typescript,
    needsRouter = argv.router,
    needsPinia = argv.pinia,
    needsVitest = argv.vitest || argv.tests,
    needsEslint = argv.eslint || argv['eslint-with-prettier'],
    needsPrettier = argv['eslint-with-prettier']
  } = result

  const { needsE2eTesting } = result
  const needsCypress = argv.cypress || argv.tests || needsE2eTesting === 'cypress'
  const needsCypressCT = needsCypress && !needsVitest
  const needsPlaywright = argv.playwright || needsE2eTesting === 'playwright'
  const iskanpon = true

  // 当前工作目录加项目名称组合出项目的根目录
  const root = path.join(cwd, targetDir)

  // 如果目录存在并且需要重写则进行重写;
  // 如果目录不存在则创建
  if (fs.existsSync(root) && shouldOverwrite) {
    emptyDir(root)
  } else if (!fs.existsSync(root)) {
    fs.mkdirSync(root)
  }

  console.log(`\nScaffolding project in ${root}...`)

  // 生成一个基础的 package.json 文件;
  const pkg = { name: packageName, version: '0.0.0' }
  fs.writeFileSync(path.resolve(root, 'package.json'), JSON.stringify(pkg, null, 2))

  // todo:
  // work around the esbuild issue that `import.meta.url` cannot be correctly transpiled
  // when bundling for node and the format is cjs
  // const templateRoot = new URL('./template', import.meta.url).pathname

  //  定义模板文件渲染函数并生成项目基础文件
  const templateRoot = path.resolve(__dirname, 'template')
  const render = function render(templateName) {
    const templateDir = path.resolve(templateRoot, templateName)
    renderTemplate(templateDir, root)
  }

  // 拿到模板文件目录
  // 调用 renderTemplate 进行核心操作。这里只需要知道对模板进行渲染就可以了，具体实现放到后面来看。
  // 根据用户配置生成基础文件

  // Render base template
  render('base')

  // Add configs.
  if (needsJsx) {
    render('config/jsx')
  }
  if (needsRouter) {
    render('config/router')
  }
  if (needsPinia) {
    render('config/pinia')
  }
  if (needsVitest) {
    render('config/vitest')
  }
  if (needsCypress) {
    render('config/cypress')
  }
  if (needsCypressCT) {
    render('config/cypress-ct')
  }
  if (needsPlaywright) {
    render('config/playwright')
  }
  if (needsTypeScript) {
    render('config/typescript')

    // Render tsconfigs
    render('tsconfig/base')
    if (needsCypress) {
      render('tsconfig/cypress')
    }
    if (needsCypressCT) {
      render('tsconfig/cypress-ct')
    }
    if (needsPlaywright) {
      render('tsconfig/playwright')
    }
    if (needsVitest) {
      render('tsconfig/vitest')
    }
  }

  // kanpon default config
  if (iskanpon) {
    render('config/axios')
    render('config/element-plus')
    render('config/sass')
    render('config/husky')
    render('config/deploy')
  }

  // Render ESLint config
  // 渲染生成 EsLint 配置
  // renderEslint 函数的实现流程和 renderTemplate 函数的实现流程类似。
  if (needsEslint) {
    renderEslint(root, { needsTypeScript, needsCypress, needsCypressCT, needsPrettier, iskanpon })
  }

  // Render code template.
  // prettier-ignore

  // 渲染生成代码模板
  if (iskanpon) {
    render('code/kanpon-default')
  } else {
    const codeTemplate =
    (needsTypeScript ? 'typescript-' : '') +
    (needsRouter ? 'router' : 'default')
  render(`code/${codeTemplate}`)
  }

  // Render entry file (main.js/ts).
  if (iskanpon && needsPinia && needsRouter) {
    render('entry/kanpon-default')
  } else if (needsPinia && needsRouter) {
    render('entry/router-and-pinia')
  } else if (needsPinia) {
    render('entry/pinia')
  } else if (needsRouter) {
    render('entry/router')
  } else {
    render('entry/default')
  }

  // Cleanup.

  // We try to share as many files between TypeScript and JavaScript as possible.
  // If that's not possible, we put `.ts` version alongside the `.js` one in the templates.
  // So after all the templates are rendered, we need to clean up the redundant files.
  // (Currently it's only `cypress/plugin/index.ts`, but we might add more in the future.)
  // (Or, we might completely get rid of the plugins folder as Cypress 10 supports `cypress.config.ts`)

  // 如果需要 TS
  // 调用 preOrderDirectoryTraverse 函数来进行文件转换。
  if (needsTypeScript) {
    // Convert the JavaScript template to the TypeScript
    // Check all the remaining `.js` files:
    //   - If the corresponding TypeScript version already exists, remove the `.js` version.
    //   - Otherwise, rename the `.js` file to `.ts`
    // Remove `jsconfig.json`, because we already have tsconfig.json
    // `jsconfig.json` is not reused, because we use solution-style `tsconfig`s, which are much more complicated.
    preOrderDirectoryTraverse(
      root,
      () => {},
      (filepath) => {
        // 这里在调用的时候最后一个回调函数有具体的操作:
        // 如果是 js 文件则将 js 文件删除并更名为 ts 文件
        // 如果有 jsconfig.json 文件则将其删除

        // 禁止转ts的js文件
        if (path.basename(filepath) == 'deploy.js' || path.basename(filepath) == 'deployConfig.js') return

        if (filepath.endsWith('.js')) {
          const tsFilePath = filepath.replace(/\.js$/, '.ts')
          if (fs.existsSync(tsFilePath)) {
            fs.unlinkSync(filepath)
          } else {
            fs.renameSync(filepath, tsFilePath)
          }
        } else if (path.basename(filepath) === 'jsconfig.json') {
          fs.unlinkSync(filepath)
        }
      }
    )

    // Rename entry in `index.html`
    const indexHtmlPath = path.resolve(root, 'index.html')
    const indexHtmlContent = fs.readFileSync(indexHtmlPath, 'utf8')
    fs.writeFileSync(indexHtmlPath, indexHtmlContent.replace('src/main.js', 'src/main.ts'))
  } else {
    // Remove all the remaining `.ts` files
    preOrderDirectoryTraverse(
      root,
      () => {},
      (filepath) => {
        if (filepath.endsWith('.ts')) {
          fs.unlinkSync(filepath)
        }
      }
    )
  }

  // Instructions:
  // Supported package managers: pnpm > yarn > npm

  // 根据包管理工具生成 README 文件，并给出提示

  // 获取到使用的是什么包管理工具
  const userAgent = process.env.npm_config_user_agent ?? ''
  // const packageManager = /pnpm/.test(userAgent) ? 'pnpm' : /yarn/.test(userAgent) ? 'yarn' : 'npm'

  const packageManager = 'pnpm'
  // README generation
  fs.writeFileSync(
    path.resolve(root, 'README.md'),
    generateReadme({
      projectName: result.projectName ?? result.packageName ?? defaultProjectName,
      packageManager,
      needsTypeScript,
      needsVitest,
      needsCypress,
      needsPlaywright,
      needsCypressCT,
      needsEslint
    })
  )

  console.log(`\nDone. Now run:\n`)
  if (root !== cwd) {
    const cdProjectName = path.relative(cwd, root)
    console.log(
      `  ${bold(green(`cd ${cdProjectName.includes(' ') ? `"${cdProjectName}"` : cdProjectName}`))}`
    )
  }
  console.log(`  ${bold(green(getCommand(packageManager, 'install')))}`)
  if (needsPrettier) {
    console.log(`  ${bold(green(getCommand(packageManager, 'format')))}`)
  }
  console.log(`  ${bold(green(getCommand(packageManager, 'dev')))}`)
  console.log()
}

init().catch((e) => {
  console.error(e)
})
