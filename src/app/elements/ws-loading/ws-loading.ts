export class WsLoading{
    private loading: boolean;
    constructor(initialState: boolean = false){
        this.loading = initialState;
    }
    start(){
        this.loading = true;
    }
    isRunning(){
        return this.loading;
    }
    stop(){
        this.loading = false;
    }
}