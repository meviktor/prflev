const regex = {};

regex.buildContainsRegex = function(wordArray){
    let regex = "";
    for(let i = 0; i < wordArray.length; i++){
        regex = ((i + 1) < wordArray.length) ? regex.concat(`(${wordArray[i]})|`) : regex.concat(`(${wordArray[i]})`);
    }
    return regex;
}

export default regex;