export interface DialogButton {
    text: string;
    action: () => void | Promise<void>;
    color?: string;
    main?: boolean;
    link?: string;
    timeout?: number;
}

export type SmallDialogIcons = "warn-red"; 