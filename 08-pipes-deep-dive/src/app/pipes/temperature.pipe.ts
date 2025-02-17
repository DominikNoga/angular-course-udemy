import { Pipe, PipeTransform } from '@angular/core';

type TemperatureType = 'f' | 'c';

@Pipe({
  name: 'temp',
  standalone: true
})
export class TemperaturePipe implements PipeTransform {

  transform(value: number| string, inputType: TemperatureType, outputType?: TemperatureType): string {
    let displayedValue: string;
    if (typeof value === 'string') {
      value = parseFloat(value);
    }
    if (outputType && outputType !== inputType) {
      displayedValue = this.convertValue(value, outputType);
    } else {
      displayedValue = inputType === 'f' ? this.valueInFarenheit(value) : this.valueInCelsius(value);
    }
    return displayedValue;
  }

  private convertValue(value: number, outputType: TemperatureType): string {
    const temp = outputType === 'f' ? this.toFahrenheit(value) : this.toCelsius(value);
    return outputType === 'f' ? this.valueInFarenheit(temp) : this.valueInCelsius(temp);
  }

  private valueInCelsius(value: number): string {
    return `${this.rounded(value)} °C`;
  }

  private valueInFarenheit(value: number): string {
    return `${this.rounded(value)} F`;
  }

  private toCelsius(fahrenheit: number): number {
    return (fahrenheit - 32) * 5 / 9;
  }

  private toFahrenheit(celsius: number): number {
    return celsius * 9 / 5 + 32;
  }

  private rounded(value: number): string {
    return value.toFixed(1);
  }
}
