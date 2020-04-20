import { Injectable } from '@angular/core';

@Injectable()
export class CategoryDropDownFormatter{
    /**
     * Retrurns the list of product categories can be used with dropdowns ('id' as the value, 'path' to display in the dropdown).
     * @param input List of catergories returned by the API endpoint.
     */
    format(input: any){
        let output =[];

        for(let category of input){
            let item = {
                id: category.id,
                path: ''
            };
            
            let path = [];
            let nextCategoryId = category.id;
            while(nextCategoryId){
                //filter should result an array containing one item
                const foundCategory = input.filter(category => category.id == nextCategoryId)[0];
                path.push(foundCategory.name);
                nextCategoryId = foundCategory.parentCategoryId;
            }
            path = path.reverse();

            let categoryPath = '';
            for(let i = 0; i < path.length; i++){
                categoryPath += ((i + 1) < path.length) ? path[i] + " > " : path[i];
            }
            item.path = categoryPath;

            output.push(item);
        }

        output.sort((item1, item2) => {
            let item1Path = item1.path.toLowerCase();
            let item2Path = item2.path.toLowerCase();
            return (item1Path < item2Path) ? -1 : ((item1Path > item2Path) ? 1 : 0);
        });
        
        return output;
    }
}