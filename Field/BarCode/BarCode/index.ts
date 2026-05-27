import { IInputs, IOutputs } from "./generated/ManifestTypes";
import * as JsBarcode from "jsbarcode";

export class BarCode implements ComponentFramework.StandardControl<IInputs, IOutputs> {
    private _barCodeValue: string;
    private _format: string;
    private _text: string;
    private _fontOptions: string;
    private _width: number;
    private _height: number;
    private _displayValue: number;
    private _font: string;
    private _textAlign: string;
    private _textPosition: string;
    private _fontSize: number;
    private _backgroundColor: string;
    private _lineColor: string;
    private _textMargin: number;
    private _margin: number;
    private _marginTop: number;
    private _marginBottom: number;
    private _marginLeft: number;
    private _marginRight: number;
    private _flat: number;
    private _formatValid: string[] = ["EAN13", "UPC", "EAN8", "EAN5", "EAN2", "CODE128", "CODE128A", "CODE128B", "CODE128C", "CODE39", "ITF14", "MSI", "MSI10", "MSI11", "MSI1010", "MSI1110", "pharmacode", "codabar"];
    private _isValid: boolean = true;

    private _container: HTMLDivElement;
    private _context: ComponentFramework.Context<IInputs>;
    private _imageBarCode: HTMLImageElement;
    private _printButton: HTMLButtonElement;

    constructor() {

    }

    public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container: HTMLDivElement) {
        this._context = context;
        this._container = container;
        this._container = document.createElement("div");
        container.appendChild(this._container);
        this.GetAllParameters();
        this._isValid = this.CheckParametersAreValids();
    }

    public updateView(context: ComponentFramework.Context<IInputs>): void {
        this.RemoveChildItems();
        this._barCodeValue = this._context.parameters.barCodeValue == undefined || this._context.parameters.barCodeValue.raw == null ? "EAN13" : this._context.parameters.barCodeValue.raw;
        if (this._isValid) {
            const containerDiv = document.createElement("div");
            containerDiv.style.display = "flex";
            containerDiv.style.alignItems = "center";
            containerDiv.style.gap = "10px"; // Space between barcode and button

            const cssId: number = Math.floor(Math.random() * (1000 - 0));

            this._imageBarCode = document.createElement("img");
            this._imageBarCode.id = "barcode" + cssId;

            this._printButton = document.createElement("button");
            this._printButton.id = "print" + cssId;
            this._printButton.innerHTML = `Print Barcode`;
            this._printButton.style.padding = "8px 12px";
            this._printButton.style.border = "none";
            this._printButton.style.backgroundColor = "#0078D7";
            this._printButton.style.color = "#fff";
            this._printButton.style.borderRadius = "4px";
            this._printButton.style.cursor = "pointer";
            this._printButton.style.display = "flex";
            this._printButton.style.alignItems = "center";

            this._printButton.onclick = () => {
                const image: HTMLElement = document.getElementById("barcode" + cssId)!;
                const imageSrc = image.getAttribute("src");

                // Open a new window for printing
                const printWindow = window.open('', '_blank');
                if (printWindow) {
                    printWindow.document.write(`
						<html>
						<head>
							<title>Print Barcode</title>
							<style>
								@media print {
                                    @page {
                                        size: A4 landscape;
                                        margin: 0;
                                    }
                                    body {
                                        margin: 0;
                                        padding: 0;
                                        color: black;
                                        background: white;
                                    }
                                    header, footer {
                                        display: none;
                                    }
                                    img {
                                        max-width: 100%;
                                        height: auto;
                                    }
                                }
							</style>
						</head>
						<body>
							<img src="${imageSrc}" alt="Barcode" />
							<script>
								window.onload = function() {
									window.print();
									window.close();
								};
							</script>
						</body>
						</html>
					`);
                    printWindow.document.close(); // Finish loading the content
                } else {
                    alert('Pop-up blocked! Please allow pop-ups for this website.');
                }
            };

            this._container.appendChild(this._imageBarCode);
            this._container.appendChild(this._printButton);

            try {
                JsBarcode("#barcode" + cssId, this._barCodeValue, {
                    format: this._format,
                    width: this._width,
                    height: this._height,
                    displayValue: this._displayValue == 1 ? true : false,
                    text: this._text.length > 0 ? this._text : this._barCodeValue,
                    fontOptions: this._fontOptions,
                    font: this._font,
                    textAlign: this._textAlign,
                    textPosition: this._textPosition,
                    textMargin: this._textMargin,
                    fontSize: this._fontSize,
                    background: this._backgroundColor,
                    lineColor: this._lineColor,
                    margin: this._margin,
                    marginTop: this._marginTop,
                    marginBottom: this._marginBottom,
                    marginLeft: this._marginLeft,
                    marginRight: this._marginRight,
                    flat: this._flat == 1 ? true : false,
                });
            } catch (error) {
                console.log("[BARCODE] Error when trying to render the barcode : " + error)
            }
        }
    }

    private GetAllParameters(): void {
        this._barCodeValue = this._context.parameters.barCodeValue == undefined || this._context.parameters.barCodeValue.raw == null ? "" : this._context.parameters.barCodeValue.raw;
        this._format = this._context.parameters.format == undefined || this._context.parameters.format.raw == null ? "EAN13" : this._context.parameters.format.raw;
        this._width = this._context.parameters.width == undefined || this._context.parameters.width.raw == null ? 2 : this._context.parameters.width.raw;
        this._height = this._context.parameters.height == undefined || this._context.parameters.height.raw == null ? 100 : this._context.parameters.height.raw;
        this._text = this._context.parameters.text == undefined || this._context.parameters.text.raw == null ? "" : this._context.parameters.text.raw;
        this._fontOptions = this._context.parameters.fontOptions == undefined || this._context.parameters.fontOptions.raw == null ? "" : this._context.parameters.fontOptions.raw;
        this._displayValue = this._context.parameters.displayValue == undefined || this._context.parameters.displayValue.raw == null ? 1 : this._context.parameters.displayValue.raw;
        this._font = this._context.parameters.font == undefined || this._context.parameters.font.raw == null ? "monospace" : this._context.parameters.font.raw;
        this._textAlign = this._context.parameters.textAlign == undefined || this._context.parameters.textAlign.raw == null ? "center" : this._context.parameters.textAlign.raw;
        this._textPosition = this._context.parameters.textPosition == undefined || this._context.parameters.textPosition.raw == null ? "bottom" : this._context.parameters.textPosition.raw;
        this._textMargin = this._context.parameters.textMargin == undefined || this._context.parameters.textMargin.raw == null ? 2 : this._context.parameters.textMargin.raw;
        this._fontSize = this._context.parameters.fontSize == undefined || this._context.parameters.fontSize.raw == null ? 20 : this._context.parameters.fontSize.raw;
        this._backgroundColor = this._context.parameters.backgroundColor == undefined || this._context.parameters.backgroundColor.raw == null ? "#fcba03" : this._context.parameters.backgroundColor.raw;
        this._lineColor = this._context.parameters.lineColor == undefined || this._context.parameters.lineColor.raw == null ? "#000000" : this._context.parameters.lineColor.raw;
        this._fontSize = this._context.parameters.fontSize == undefined || this._context.parameters.fontSize.raw == null ? 20 : this._context.parameters.fontSize.raw;
        this._margin = this._context.parameters.margin == undefined || this._context.parameters.margin.raw == null ? 10 : this._context.parameters.margin.raw;
        this._marginTop = this._context.parameters.marginTop == undefined || this._context.parameters.marginTop.raw == null ? 0 : this._context.parameters.marginTop.raw;
        this._marginBottom = this._context.parameters.marginBottom == undefined || this._context.parameters.marginBottom.raw == null ? 0 : this._context.parameters.marginBottom.raw;
        this._marginLeft = this._context.parameters.marginLeft == undefined || this._context.parameters.marginLeft.raw == null ? 0 : this._context.parameters.marginLeft.raw;
        this._marginRight = this._context.parameters.marginRight == undefined || this._context.parameters.marginRight.raw == null ? 0 : this._context.parameters.marginRight.raw;
        this._flat = this._context.parameters.flat == undefined || this._context.parameters.flat.raw == null ? 1 : this._context.parameters.flat.raw;
    }

    private CheckParametersAreValids(): boolean {
        if (this._formatValid.indexOf(this._format) < 0)
            return false;
        else
            return true;
    }

    private RemoveChildItems() {
        while (this._container.firstChild) {
            this._container.removeChild(this._container.firstChild);
        }
    }

    public getOutputs(): IOutputs {
        return {};
    }

    public destroy(): void {
    }
}
