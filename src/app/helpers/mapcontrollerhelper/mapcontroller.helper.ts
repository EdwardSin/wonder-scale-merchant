import { MapController } from '@objects/map.controller';
export class MapcontrollerHelper{
    static KEY_DOWN = 40;
    static KEY_UP = 38;
    static KEY_ESC = 27;
    static TAB = 9;
    static LAST_POSITION = 4;
    static FIRST_POSITION = 0;    
    static ENTER = 13;

    public static selectAddress(event, hovered, mapController: MapController) {
        const Key_Pressed = event.keyCode;
        switch (Key_Pressed) {
            case MapcontrollerHelper.KEY_DOWN:
                if (this.isSuggestionDisplay(mapController)) {
                    return this.isLastPosition(hovered) ? MapcontrollerHelper.LAST_POSITION : this.hovered_Down(hovered);
                }
                break;
            case MapcontrollerHelper.KEY_UP:
                if (this.isSuggestionDisplay(mapController)) {
                    return this.isFirstPosition(hovered) ? MapcontrollerHelper.FIRST_POSITION : this.hovered_Up(hovered);
                }
                break;
            case MapcontrollerHelper.KEY_ESC:
            this.hideSuggestion(mapController);
                break;
            case MapcontrollerHelper.TAB:
            case MapcontrollerHelper.ENTER:
                return hovered;    
        }
        return 0;
        
    }
    private static hovered_Down(hovered): number {
        return hovered + 1;
    }
    private static hovered_Up(hovered): number {
        return hovered - 1;
    }
    private static hideSuggestion(mapController) {
        mapController.displayed = false;
    }
    private static isSuggestionDisplay(mapController): boolean {
        return mapController.displayed;
    }
    private static isLastPosition(hovered): boolean {
        return hovered === MapcontrollerHelper.LAST_POSITION;
    }
    private static isFirstPosition(hovered): boolean {
        return hovered === MapcontrollerHelper.FIRST_POSITION;
    }
}