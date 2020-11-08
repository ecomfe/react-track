module.exports = {
    extends: require.resolve('reskript/config/eslint'),
    rules: {
        '@typescript-eslint/no-unused-vars': [
            'error',
            {
                varsIgnorePattern: 'React',
            },
        ],
    },
};
