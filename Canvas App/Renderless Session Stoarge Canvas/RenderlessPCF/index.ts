import { IInputs, IOutputs } from "./generated/ManifestTypes";

export class RenderlessPCF implements ComponentFramework.StandardControl<IInputs, IOutputs> {
    private context_: ComponentFramework.Context<IInputs>
    constructor() {
        // Empty
    }

    public init(
        context: ComponentFramework.Context<IInputs>,
        notifyOutputChanged: () => void,
        state: ComponentFramework.Dictionary,
        container: HTMLDivElement
    ): void {
        this.context_ = context;
        sessionStorage.removeItem(this.context_.parameters.sessionStorageKey.raw!);
    }

    public updateView(context: ComponentFramework.Context<IInputs>): void {
        const props = this.context_.parameters.data.raw;
        if (props.result == true) {
            sessionStorage.setItem(this.context_.parameters.sessionStorageKey.raw!, JSON.stringify(props));
        }
    }

    public getOutputs(): IOutputs {
        return {};
    }

    public destroy(): void {
        // Empty
    }
}
