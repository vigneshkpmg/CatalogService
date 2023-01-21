import express from "./infrastructure/provider/express"
import database from "./infrastructure/provider/database";

class StartUp{

    public static init(): void{
        database.Init();
        express.init();
    }
}

StartUp.init();