export function random(len:number){
    let options="sdfhjwjfbjwhfkefhflkafhfwq";
    let result="";
    for(let i=0;i<len;i++){
        result+=options[Math.floor(Math.random()*options.length)];
    }
    return result;
}