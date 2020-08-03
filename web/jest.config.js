module.exports = {
  // jest 的预设、默认配置
  preset: '@vue/cli-plugin-unit-jest',
  // 错误为 1 时，便暂停测试，默认为 0
  bail: 1,
  // 理解为 beforeEach jest.clearAllMocks()
  clearMocks: true,
  // globals全局对象
  globals: {
    __DEV: true,
    __FRAME: 'VUE',
    __TEST: true
  },
  collectCoverage: true
}

// preset 如下内容为 vue 脚手架搭建时候的默认设置
// {
//   moduleFileExtensions: [
//     'js',
//     'jsx',
//     'json',
//     // tell Jest to handle *.vue files
//     'vue'
//   ],
//   transform: {
//     // process *.vue files with vue-jest
//     '^.+\\.vue$': require.resolve('vue-jest'),
//     '.+\\.(css|styl|less|sass|scss|svg|png|jpg|ttf|woff|woff2)$':
//     require.resolve('jest-transform-stub'),
//     '^.+\\.jsx?$': require.resolve('babel-jest')
//   },
//   transformIgnorePatterns: ['/node_modules/'],
//   // support the same @ -> src alias mapping in source code
//   moduleNameMapper: {
//     '^@/(.*)$': '<rootDir>/src/$1'
//   },
//   testEnvironment: 'jest-environment-jsdom-fifteen',
//   // serializer for snapshots
//   snapshotSerializers: [
//     'jest-serializer-vue'
//   ],
//   testMatch: [
//     '**/tests/unit/**/*.spec.[jt]s?(x)',
//     '**/__tests__/*.[jt]s?(x)'
//   ],
//   // https://github.com/facebook/jest/issues/6766
//   testURL: 'http://localhost/',
//   watchPlugins: [
//     require.resolve('jest-watch-typeahead/filename'),
//     require.resolve('jest-watch-typeahead/testname')
//   ]
// }
