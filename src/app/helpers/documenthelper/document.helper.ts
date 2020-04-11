// @dynamic
export class DocumentHelper{
    private static unread_number;
    private static title;

    public static setWindowTitle(title?: string){
        this.setTitle(title);
        document.title = this.getTitle();
    }
    public static setWindowTitleWithWonderScale(title?: string){
        this.setTitle(title + " - Wonder Scale");
        document.title = this.getTitle();
    }
    public static getTitle(){
        return this.unread_number > 0 ? '(' + this.unread_number + ') ' + this.title : this.title;
    }

    public static setUnreadNumber(unread_number: number){
        this.unread_number = unread_number;
    }

    public static setTitle(title: string){
        if(title){
            this.title = title;
        }
    }
}