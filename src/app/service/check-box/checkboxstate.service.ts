import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CheckboxstateService {

  constructor() { }

  private globalCheckboxState: boolean = false;
  private tableCheckboxStates: { [tableId: string]: { [id: number]: boolean } } = {};

  getGlobalCheckboxState(): boolean {
    return this.globalCheckboxState;
  }

  setGlobalCheckboxState(state: boolean): void {
    this.globalCheckboxState = state;
  }

  getCheckboxState(tableId: string, id:number): boolean {
    const tableState = this.tableCheckboxStates[tableId];
    return tableState ? tableState[id] || false : false;
  }

  setCheckboxState(tableId: string, id: number, state: boolean): void {
    if (!this.tableCheckboxStates[tableId]) {
      this.tableCheckboxStates[tableId] = {};
    }
    this.tableCheckboxStates[tableId][id] = state;
  }

  resetTableCheckboxState(tableId: string): void {
    this.globalCheckboxState=false;
    if (this.tableCheckboxStates[tableId]) {
      this.tableCheckboxStates[tableId] = {};
    }
  }
}
