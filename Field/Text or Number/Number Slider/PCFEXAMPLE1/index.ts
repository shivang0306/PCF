import { IInputs, IOutputs } from "./generated/ManifestTypes";

export class PCFEXAMPLE1 implements ComponentFramework.StandardControl<IInputs, IOutputs> {

    private _value: number;
    private _notifyOutputChanged: () => void;
    private labelElement: HTMLLabelElement;
    private inputElement: HTMLInputElement;
    private _container: HTMLDivElement;
    private _context: ComponentFramework.Context<IInputs>;
    private _refreshData: EventListenerOrEventListenerObject;

    constructor() { }

    public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container: HTMLDivElement): void {
        this._context = context;
        this._container = document.createElement("div");
        this._notifyOutputChanged = notifyOutputChanged;
        this._refreshData = this.refreshData.bind(this);

        this.inputElement = document.createElement("input");
        this.inputElement.setAttribute("type", "range");
        this.inputElement.addEventListener("input", this._refreshData);

        this.inputElement.setAttribute("min", "1");
        this.inputElement.setAttribute("max", "1000");
        this.inputElement.setAttribute("class", "linearslider");
        this.inputElement.setAttribute("id", "linearrangeinput");

        this.labelElement = document.createElement("label");
        this.labelElement.setAttribute("class", "LinearRangeLabel");
        this.labelElement.setAttribute("id", "lrclabel");

        this._value = context.parameters.controlValue.raw!;
        this.inputElement.setAttribute(
            "value",
            context.parameters.controlValue.formatted
                ? context.parameters.controlValue.formatted
                : "0"
        );

        this.labelElement.innerHTML = context.parameters.controlValue.formatted
            ? context.parameters.controlValue.formatted
            : "0";

        // appending the HTML elements to the control's HTML container element.
        this._container.appendChild(this.inputElement);
        this._container.appendChild(this.labelElement);
        container.appendChild(this._container);
    }



    public updateView(context: ComponentFramework.Context<IInputs>): void {
        this._value = context.parameters.controlValue.raw!;
        this._context = context;
        this.inputElement.setAttribute(
            "value",
            context.parameters.controlValue.formatted
                ? context.parameters.controlValue.formatted
                : ""
        );
        this.labelElement.innerHTML = context.parameters.controlValue.formatted
            ? context.parameters.controlValue.formatted
            : "";
    }

    public getOutputs(): IOutputs {
        return {
            controlValue: this._value,
        };
    }


    public destroy(): void {
        this.inputElement.removeEventListener("input", this._refreshData);
    }

    public refreshData(evt: Event): void {
        this._value = this.inputElement.value as any as number;
        this.labelElement.innerHTML = this.inputElement.value;
        this._notifyOutputChanged();
    }
}
