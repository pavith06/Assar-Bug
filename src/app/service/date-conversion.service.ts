import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DateConversionService {

  constructor() { }

  convertAdjustedISOString(datePickerString:string) : string{
       const parsedDate =new Date(datePickerString);
       // Get the time zone offset in minutes
      const timeOffsetInMinutes= parsedDate.getTimezoneOffset();
      // Adjust the parsed date by adding the time zone offset
      const adjustedDate= new Date(parsedDate.getTime() + -(timeOffsetInMinutes)*60*1000);
       // Convert the adjusted date to ISO 8601 format
      const IsoFormattedDateStr=adjustedDate.toISOString();
      return IsoFormattedDateStr;
  }

  convertAdjustedISOStringAtEndOfTheDay(datePickerString:string) : string{
    const parsedDate =new Date(datePickerString);
    parsedDate.setHours(23,59,59,999)
    // Get the time zone offset in minutes
   const timeOffsetInMinutes= parsedDate.getTimezoneOffset();
   // Adjust the parsed date by adding the time zone offset
   const adjustedDate= new Date(parsedDate.getTime() + -(timeOffsetInMinutes)*60*1000);
    // Convert the adjusted date to ISO 8601 format
   const IsoFormattedDateStr=adjustedDate.toISOString();
   return IsoFormattedDateStr;
}
}
