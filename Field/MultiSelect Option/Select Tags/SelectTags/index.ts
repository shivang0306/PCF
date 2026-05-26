import { IInputs, IOutputs } from "./generated/ManifestTypes";

export class SelectTags
	implements ComponentFramework.StandardControl<IInputs, IOutputs>
{
	private _context: ComponentFramework.Context<IInputs>;
	private _container: HTMLDivElement;
	private _mainContainer: HTMLDivElement;
	private _unorderedList: HTMLUListElement;
	private _errorLabel: HTMLLabelElement;
	public _guidList: string[];
	private _checkBoxChanged: EventListenerOrEventListenerObject;
	private _notifyOutputChanged: () => void;
	multiFieldSelect: any;
	options: any[];
	private intialValue: number[] | null = [];
	notifyInternal: boolean = false;

	constructor() {
		// Empty
	}

	public init(
		context: ComponentFramework.Context<IInputs>,
		notifyOutputChanged: () => void,
		state: ComponentFramework.Dictionary,
		container: HTMLDivElement
	): void {
		console.log("on init calling");
		this._context = context;
		this._container = container;
		this._mainContainer = document.createElement("div");
		this._mainContainer.classList.add("multiselect-container");
		this._notifyOutputChanged = notifyOutputChanged;
		this._checkBoxChanged = this.checkBoxChanged.bind(this);
		this.multiFieldSelect = this._context.parameters.multiField;
		this._container.appendChild(this._mainContainer);
		this.PrePareOptions();
		this.RenderOptions();
	}

	PrePareOptions() {
		const multiFieldSelect = this._context.parameters.multiField as any;
		this.intialValue = this._context.parameters.multiField.raw;
		this.options = [];

		let multiFieldValue = this._context.parameters.multiField.raw;
		if (typeof multiFieldValue === "string") {
			multiFieldValue = JSON.parse(multiFieldValue);
		}
		const selectedItems = multiFieldValue;
		for (const option of multiFieldSelect.attributes.Options) {
			const op = {
				Label: option.Label,
				id: `${multiFieldSelect.attributes.LogicalName}-${option.Value}`,
				name: `${multiFieldSelect.attributes.LogicalName}-${option.Value}`,
				value: option.Value.toString(),
				isSelcted:
					(selectedItems == null
						? 0
						: selectedItems.findIndex((it: any) => it == option.Value)) > -1,
			};
            this.options.push(op);
		}
	}
	RenderOptions() {
		this._unorderedList = document.createElement("ul");
		this._errorLabel = document.createElement("label");
		this._unorderedList.classList.add("ks-cboxtags");
		this.options.forEach((option) => {
			const newUList = this.RenderOption(option);
			this._unorderedList.appendChild(newUList);
		});
		this._mainContainer.innerHTML = "";
		this._mainContainer.appendChild(this._unorderedList);
		this._mainContainer.appendChild(this._errorLabel);
	}
	SaveEventListerner(initialValue: any) {
		this.intialValue = initialValue;
		this.PrePareOptions();
		this.RenderOptions();
	}
	RenderOption(option: any) {
		const newLabels = option.Label;
		const newChkBox = document.createElement("input");
		const newLabel = document.createElement("label");
		const newUList = document.createElement("li");
		newChkBox.type = "checkbox";
		newChkBox.id = option.id;
		newChkBox.name = option.name;
		newChkBox.value = option.value.toString();
		newChkBox.checked = option.isSelcted;
		newChkBox.addEventListener("change", this._checkBoxChanged);
		newLabel.innerHTML = newLabels;
		newLabel.htmlFor = option.id;
		if (this.intialValue && this.intialValue.indexOf(+option.value) > -1) {
			newLabel.classList.add("preselected");
		}
		newUList.appendChild(newChkBox);
		newUList.appendChild(newLabel);
		return newUList;
	}

	public updateView(context: ComponentFramework.Context<IInputs>): void {
		this._context = context;
		if (this.notifyInternal) {
			this.notifyInternal = false;
		} else {
			this.intialValue = this._context.parameters.multiField.raw;
		}
		let multiFieldValue = this._context.parameters.multiField.raw;
		if (typeof multiFieldValue === "string")
			multiFieldValue = JSON.parse(multiFieldValue);
		const selectedItems = multiFieldValue;
		if (
			this.options.length !==
			context.parameters.multiField.attributes?.Options.length
		) {
			this.PrePareOptions();
		}
		this.options.forEach((it) => {
			it.isSelcted =
				selectedItems != undefined
					? selectedItems.findIndex((sl) => sl == it.value) > -1
					: false;
		});
		this.RenderOptions();
		console.log("updateView");
	}

	checkBoxChanged(evnt: any) {
		const targetInput = evnt.target;
		console.log(evnt.target);
		const ooption = this.options.find((it) => it.value == +targetInput.value);
		ooption.isSelcted = targetInput.checked;
		this.notifyInternal = true;
		this._notifyOutputChanged();
	}

	public getOutputs(): IOutputs {
		return {
			multiField: this.options
				.filter((it) => it.isSelcted)
				.map((it) => +it.value),
		};
	}

	public destroy(): void {
		// Add code to cleanup control if necessary
	}
}
