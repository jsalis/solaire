module.exports = (api) => {
    const envConfig = api.env("test")
        ? { targets: { node: "current" } }
        : { modules: false, forceAllTransforms: true };

    return {
        presets: [["@babel/preset-env", envConfig]],
    };
};
