export const createName = async (names : String[]) => {   
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const nums = "0123456789";
    let name = "";
    for(let i = 0; i < 5; i++){
        const random = Math.floor(Math.random()*26);
        name += alphabet[random];
    }
    for(let i = 0; i < 3; i++){
        const random = Math.floor(Math.random()*10);
        name += nums[random];
    }
    while(!uniquename(name, names)){
        for(let i = 0; i < 5; i++){
            const random = Math.floor(Math.random()*26);
            name += alphabet[random];
        }
        for(let i = 0; i < 3; i++){
            const random = Math.floor(Math.random()*10);
            name += nums[random];
        }
    }
    return name;
}

const uniquename = async (name: string, names: String[]) => {
    for(let i = 0; i < names.length; i++){
        if(name === names[i]){
            return false;
        }
    }
    return true;
}