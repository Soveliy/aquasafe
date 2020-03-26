/* Формет вызова

  calculate_dose({  
    water_replace_percent: "20%",          //процент замены воды
    replace_frequency: "1 раз в неделю",   //частота
    aqua_volume: 100,                      //объем аквариума
    err_elem_selector: "#errors"           //селектор элемента в который выводить ошибки (не обязательный)
  })

*/



(function(){


function calculate_dose(params){
    try{
        const bottle_volume = get_bottle_volume(params);

        switch(true){
            case (bottle_volume >= 0 && bottle_volume < 60):
                return {size : 50, amount: 1 };
            case (bottle_volume>=60 && bottle_volume<110):
                return {size:100, amount:1};
            case (bottle_volume>=110 && bottle_volume<270):
                return {size:250, amount:1};
            case (bottle_volume>=270 && bottle_volume<600):
                return {size:500, amount:1};
            case (bottle_volume >= 600 && bottle_volume<1100):
                return {size:500, amount:2};
            case (bottle_volume >=1100 && bottle_volume<3000):
                return {size:500, amount: Math.ceil(bottle_volume/500)};
            case (bottle_volume >= 3000):
                return {size: 5000, amount: Math.ceil(bottle_volume/5000)};
            default:
                throw_error("Неправильный объем средства!", params.err_elem_selector);
        }
    }
    catch(err){
      console.log(err);
    }
}

function get_bottle_volume(params){
    try{
        const {water_replace_percent, replace_frequency, aqua_volume} = params; 
        if(!water_replace_percent||!replace_frequency||!isNumeric(aqua_volume)||aqua_volume<0) 
            throw_error("Неправильные параметры!", params.err_elem_selector);
        if(!["10%", "20%", "30%","40%","50%"].includes(water_replace_percent)) 
            throw_error("Неправильный процент подмены воды!", params.err_elem_selector);
        
        let replace_frequency_coef = 0;
        switch(replace_frequency){
            case "1 раз в неделю":
                replace_frequency_coef = 54;
                break;
            case "1 раз в 2 недели":
                replace_frequency_coef = 27;
                break;
            case "1 раз в месяц":
                replace_frequency_coef = 12;
                break;
            default:
                throw_error("Неправильная частота подмены!", params.err_elem_selector);
        }

        return  (parseFloat(water_replace_percent) * replace_frequency_coef * aqua_volume) / 1000 * 5;
        
    }
    catch(err){    
      console.log(err);
    }
}


function throw_error(message,err_elem_selector){
    if(err_elem_selector){
        document.querySelector(err_elem_selector).innerText = message;
        return;
    }
    throw new Error(message);
}


function isNumeric(n){
    return !isNaN(parseFloat(n)) && isFinite(n);
}



window.calculate_dose = calculate_dose;
})();