export interface EventColor {
    primary: string,
    secondary: string
}

export interface Events {
    id?: any,
    title: string,
    start?: any,
    end?: any,
    color?: EventColor,
    draggable?: any,
    resizable?: any,
    actions?: any
}