module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    moduleNameMapper: {
        "src/(.*)": "<rootDir>/src/$1",
        "v1/(.*)": "<rootDir>/src/v1/$1",
        "database/(.*)": "<rootDir>/src/database/$1",
    },
    transform: {
        "^.+\\.tsx?$": "ts-jest",
    },
    moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],
};
