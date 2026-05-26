import { IInputs, IOutputs } from "./generated/ManifestTypes";
import DataSetInterfaces = ComponentFramework.PropertyHelper.DataSetApi;
type DataSet = ComponentFramework.PropertyTypes.DataSet;
import * as React from "react";
import * as ReactDOM from "react-dom";
import iPropsInput from "./interfaces/iPropsInput";
import CalloutControlComponent from "./components/CalloutControlComponent";

export class GenericLookup
  implements ComponentFramework.StandardControl<IInputs, IOutputs>
{
  private _container: HTMLDivElement;
  private _context: ComponentFramework.Context<IInputs>;
  private _optionSets: any[];
  private _config: any;
  private props: iPropsInput;
  private _currentValue: string | null;
  private notifyOutputChanged: () => void;

  constructor() {
    //empty constructor
  }

  public init(
    context: ComponentFramework.Context<IInputs>,
    notifyOutputChanged: () => void,
    state: ComponentFramework.Dictionary,
    container: HTMLDivElement
  ) {
    this._container = container;
    this._context = context;
    this.notifyOutputChanged = notifyOutputChanged;

    this.props = {
      context: this._context,
      optionSets: this._optionSets,
      gridConfig: this._config,
      onchange: (currentValue?: string | null) => {
        this._currentValue = currentValue ? currentValue : null;
        this.notifyOutputChanged();
      },
	  isDisabled: context.mode.isControlDisabled
    };
  }

  public async updateView(context: ComponentFramework.Context<IInputs>) {
    this._context = context;
    this.props.context = this._context;
	this.props.isDisabled = context.mode.isControlDisabled
    ReactDOM.render(
      React.createElement(CalloutControlComponent, this.props),
      this._container
    );
  }

  public getOutputs(): IOutputs {
    return {
      DummyLookupField: this._currentValue || "",
    };
    //   return {};
  }

  public destroy(): void {
    ReactDOM.unmountComponentAtNode(this._container);
  }
}
