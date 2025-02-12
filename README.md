# 1. root/ package.json 설정 사항
```json
{
    "name": "react-monorepo-test",
    // private: true => 배포방지
    // 모노레포는 여러 패키지를 포함하고 있기 때문에, 모든 패키지가 외부에 배포될 필요가 없을 때 private: true가 유용하다.
    "private": true, 
    // 모노레포로 관리할 프로젝트명
    "workspaces": [
        "apps/*",
        "packages/*"
    ],
    // root package.json에 스크립트를 설정해주지 않으면 프로젝트를 실행할 때마다 매번 cd ../ 으로 폴더를 옮겨다녀야한다.
    "scripts": {
        "normal": "yarn workspace normal",
        "group": "yarn workspace group"
    }
}

```

# 2. root Typescript 설정
1. 전체 워크스페이스에 Typescript 설정
   ```
    yarn add -D typescript -W
   ```
2. root/ tsconfig.json 파일 작성
   ```json
   {
        "compilerOptions": {
            "removeComments": true,
            "strict": true,
            "allowJs": true,
            "resolveJsonModule": true,
            "forceConsistentCasingInFileNames": true,
            "composite": true,
        },
        "include": ["apps/**/*", "packages/**/*"],
        "references": [
            {
            "path": "./apps/group"
            },
            {
            "path": "./apps/normal"
            }
        ],
        "exclude": [
            "node_modules",
            "**/build",
            "**/dist",
            "**/__tests__",
            "**/*.test.ts",
            "**/*.test.tsx",
            "**/*.spec.ts",
            "**/*.spec.tsx",
            "**/*.stories.tsx",
            "**/.storybook",
            "coverage",
            "storybook-static",
            "public",
            "**/eslint.config.js",
            "**/jest.config.js"
        ]
    }
   ```
   - compilerOptions   
    두 프로젝트가 공통으로 사용하는 compilerOptions(TypeScript 컴파일러가 사용하는 다양한 설정)을 설정한다.

      - removeComments: true   
        컴파일된 JavaScript 파일에서 주석을 제거한다. 최종 JavaScript 파일이 더 작아지고, 불필요한 주석을 포함하지 않게 된다.
      - strict: true   
        TypeScript의 엄격한 타입 검사 규칙을 활성화하는 설정이다. 이는 여러 개의 엄격한 타입 체크 옵션(noImplicitAny, strictNullChecks, strictFunctionTypes 등)을 모두 포함한 설정입니다. 이를 통해 코드의 타입 안전성을 최대한으로 보장한다.
        - noImplicitAny: true   
            - any 타입 사용 금지한다.
            - 암시적인 any 타입을 허용하지 않도록 설정한다. 타입이 명시되지 않으면 any로 간주되는데, 이를 방지하여 모든 변수와 매개변수에 명시적으로 타입을 지정하도록 강제한다.
        - strictNullChecks: true   
            null과 undefined를 엄격히 구분한다. 즉, null이나 undefined가 될 수 있는 값에 대해 타입이 명시되지 않으면 컴파일 오류가 발생한다. 이를 통해 런타임 오류를 줄일 수 있는 강력한 타입 안전성을 제공한다.
      - allowJs: true   
        JavaScript 파일(.js)도 TypeScript 프로젝트 내에서 허용되도록 설정한다. 이를 통해 JavaScript와 TypeScript가 혼합된 프로젝트에서도 TypeScript가 문제없이 작동한다.
      - resolveJsonModule: true   
        TypeScript에서 JSON 파일을 모듈로 불러올 수 있도록 허용한다. 이를 통해 JSON 파일을 import하여 사용할 수 있다.
      - noFallthroughCasesInSwitch: true   
        switch 문에서 case 구문이 다른 case로 이어지는 것(fallthrough)을 방지합니다. 의도적으로 break가 생략된 경우라도 오류를 발생시킵니다.
      - forceConsistentCasingInFileNames: true   
        파일 이름의 대소문자 일관성을 강제한다. 즉, 대소문자를 구분하여 파일 이름을 다르게 참조하는 것을 방지한다.
        ```
        import { myComponent } from './MyComponent'
        import { myComponent } from './mycomponent'
        동일하게 취급하지 않습니다.
        ```
      - composite: true   
        - composite: true는 TypeScript 프로젝트 간 참조를 가능   
        - 루트 tsconfig.json에 명시적인 composite 설정   
            루트 tsconfig.json 파일에서 하위 프로젝트에 대한 references를 설정할 때, TypeScript는 모든 참조된 프로젝트가 composite 모드인지 확인합니다. 따라서 루트 tsconfig.json이 하위 프로젝트들을 참조하고 있다면, 루트 파일도 composite 모드를 설정해 빌드 의존성을 명확히 해야 합니다.
        - 의존성 관리   
        composite 모드를 활성화하면 TypeScript는 각 하위 프로젝트의 빌드 결과를 .tsbuildinfo 파일로 저장하고, 이를 바탕으로 변경된 파일만 다시 빌드하여 효율성을 높입니다. 루트 파일에서 하위 프로젝트들을 제대로 인식하기 위해 루트에서도 composite을 활성화해야 합니다.
    - references

        - root의 tsconfig에게 개별 tsconfig 파일이 위치한 경로를 알려주는 역할이다. 이것이 필요한 이유는 typescript 컴파일러가 코드를 컴파일 할 때, 개별 tsconfig 파일의 내용도 알아야 하기 때문이다. (references로 root를 연결가능하도록 참조할 폴더 경로를 적으면 거기서 extends로 root tsconfig.json 경로를 적어서 연결할 수 있다.)
    - exclude
        - 여기에 설정한 값은 타입스크립트 컴파일러가 컴파일 하지 않는다. 빌드, test, storybook, node_modules 등 타입스크립트로 컴파일이 필요하지않은 파일들을 넣는다.
            ```
                "node_modules",      // 패키지 매니저가 설치한 외부 모듈
                "**/build",          // 빌드된 파일 폴더 (예: Webpack, Vite 빌드 파일)
                "**/dist",           // 배포용 빌드 결과물 폴더
                "**/__tests__",      // 테스트 코드 폴더
                "**/*.test.ts",      // 테스트 파일 (확장자는 프로젝트에 맞게 조정 가능)
                "**/*.test.tsx",
                "**/*.spec.ts",      // 테스트 스펙 파일
                "**/*.spec.tsx",
                "**/*.stories.tsx",  // 스토리북 파일
                "**/.storybook",     // 스토리북 설정 파일
                "coverage",          // 테스트 커버리지 폴더
                "storybook-static",  // 스토리북 빌드 파일
                "public",
                "**/eslint.config.js"
            ```
        위 내용을 제외하고 react에 종속된 설정은 개별 tscofig에 둔다.
3. apps/프로젝트/tsconfig.json 파일 작성
   ```json
    {
        "files": [],
        "extends": "../../tsconfig.json", // 추가
        "references": [
            { "path": "./tsconfig.app.json" },
            { "path": "./tsconfig.node.json" }
        ]
    }

   ```