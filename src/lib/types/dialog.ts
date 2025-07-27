export interface DialogButton {
    text: string;
    action: () => void | Promise<void>;
    color?: string;
    main?: boolean;
    link?: string;
    timeout?: number;
}

export type SmallDialogIcons = "warn-red";

export interface SmallDialog {
    type: "small";
    id: string;
    title?: string;
    bodyText?: string;
    bodySubText?: string;
    icon?: SmallDialogIcons | null;
    buttons?: DialogButton[] | null;
    dismissable?: boolean;
    leftAligned?: boolean;
}

export type Dialog = SmallDialog; 