import { Injectable } from '@angular/core';

@Injectable()
export class JsonDateParserExtension{
    /**
     * While parsing to JSON, searching for string values, representing a date. If so, returns a Date javascript object represented by the date string.
     */
    stringToDate(key: any, value: any): any{
        const isoDateTimeRegex = /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/;
        if(typeof value === 'string' && isoDateTimeRegex.test(value)){
            return new Date(value);
        }
        return value;
    }
}