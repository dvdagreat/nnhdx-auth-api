// vendor imports

// custom imports
import getApp from "@src/app";
import database from "@database/index";

// config app
const app = getApp({ database });
const PORT: string | number = process.env.NNHDX_AUTH_PORT! || 5002;

// run app
app.listen(PORT, () => {
    console.log("Auth API server has started on port " + PORT);
});
