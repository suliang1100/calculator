/**
 * 计算器
 * Created by suliang on 2016/10/28.
 * v2.0
 * v2.0 modified on 2016.12.29
 */
var calculator = (function(){

    var num = 0, result = 0, numshow = "0";
    var operate = 0; //判断输入状态的标志
    var calcul = 0; //判断计算状态的标志
    var flag = 0; //判断此时的输入状态是数字还是运算符

    // 数字keycode
    var keyCode = {
        "48":0,"96":0,"49":1,"97":1,"50":2,"98":2,"51":3,"99":3,"52":4,"100":4,"53":5,"101":5,"54":6,"102":6,"55":7,"103":7,"56":8,"104":8,"57":9,"105":9
    };

    // 操作keycode
    var excuteCode = {
        "107":"plus",
        "187":"plus",
        "109":"minus",
        "106":"times",
        "110":"dot",
        "111":"divide",
        "108":"equal",
        "13":"equal",
        "46":"delAll",
        "8":"del",
        "27":"clearscreen",
    }


    //初始化
    var init = function(){

        //初始化计算器显示屏
        $(".numScreen").val(0);
        $(".numScreenSave").html("");

        //绑定数字输入点击事件
        $("#useCalculatorBody").find(".number-btn").unbind("click").click(function(){

            var num = $(this).val();
            command(num);

            //防止焦点停留导致键盘输入错误
            $(this).blur();
        });

        //绑定运算符输入点击事件
        $("#useCalculatorBody").find(".tool").unbind("click").click(function(){

            var _excute = $(this).attr("data-excute");
            excuteCalcu[_excute]();

            //防止焦点停留导致键盘输入错误
            $(this).blur();
        });

        if(calculator.index == 0){
            //实现数字键盘
            $(document).on("keydown",function(e){
                if($(e.target).prop("tagName") === "BODY" || $(e.target).hasClass("numScreen")){

                    //执行数字输入
                    if(e.which in keyCode){
                        command(keyCode[e.which]);
                    }

                    //执行运算符输入
                    else if(e.which in excuteCode){
                        excuteCalcu[excuteCode[e.which]]();
                    }
                }
            });

            //修改计算器状态
            calculator.index = 1;
        }
    };

    //计算操作集合
    var excuteCalcu = {};

    //处理当前输入值
    var command = function(num) {

        //获得当前显示数据
        var str = String($(".numScreen").val());

        //如果当前值不是"0"，且状态为0，则返回当前值，否则返回空值;
        if(str !== "0"){
            if(operate !== 0){
                str = "";
            }
        }else{
            str = "";
        }

        //给当前值追加字符
        str = str + String(num);

        //最多输入13位
        if(str.length === 13){
            return false;
        }

        //刷新显示并重置输入状态
        $(".numScreen").val(str);
        operate = 0;
        flag = 0;

    };

    //处理每一步的计算结果
    var commandSave = function(){

        var _numScreen = String($(".numScreen").val());
        var _numScreenSave = $(".numScreenSave").html();

        var str = _numScreenSave + _numScreen;

        //拼接运算符
        switch (calcul) {
            case 1:
                str = str + "+";
                break;
            case 2:
                str = str + "-";
                break;
            case 3:
                str = str + "*";
                break;
            case 4:
                str = str + "/";
                break;
        }

        //处理等于的情况
        if(calcul === 0){

            //只在输入框显示最后结果
            $(".numScreenSave").html("");

            //有小数的情况
            if(String(num).indexOf(".") !== -1){
                if(String(num).indexOf("e") !== -1){
                    num = String(num);
                }else{
                    num = String(num).substr(0,14);
                }
            }

            //没有小数的情况
            else{
                String(num).substr(0,12)
            }
            $(".numScreen").val(num);
        }else{
            $(".numScreenSave").html(str); //刷新显示
            $(".numScreen").val(num);
            flag = 1;
        }

    };

    // 处理两个0情况
    excuteCalcu.dzero = function() {

        var str = String($(".numScreen").val());

        //如果当前值不是"0"，且状态为0，则返回当str+"00"，否则返回"0";
        if(str !== "0"){
            if(operate === 0){
                str = str + "00";
            }else{
                str = "0";
            }
        }else{
            str = "0";
        }
        //最多输入13位
        if(str.length >= 13){
            return false;
        }
        $(".numScreen").val(str);
        operate = 0;
    };

    // 处理小数点情况
    excuteCalcu.dot = function() {

        var str = String($(".numScreen").val());

        //如果当前值不是"0"，且状态为0，则返回当前值，否则返回"0";
        if(str !== "0"){
            if(operate !== 0){
                str = "0";
            }
        }else{
            str = "0";
        }

        //判断是否已经有一个点号,如果有则不再插入
        for (i = 0; i <= str.length; i++) {
            if (str.substr(i, 1) == ".") {
                return false;
            }
        }

        str = str + ".";
        $(".numScreen").val(str);
        operate = 0;
    };

    // 退格
    excuteCalcu.del = function() {

        var str = String($(".numScreen").val());
        str = (str != "0") ? str : "";
        str = str.substr(0, str.length - 1);
        str = (str != "") ? str : "0";
        $(".numScreen").val(str);
    };

    // 全删
    excuteCalcu.delAll = function() {
        $(".numScreen").val(0);
    };

    // 清除数据
    excuteCalcu.clearscreen = function() {
        num = 0;
        result = 0;
        numshow = "0";
        calcul = 0;
        $(".numScreen").val("0");
        $(".numScreenSave").html("");
    };

    // 加法
    excuteCalcu.plus = function() {

        //处理重写运算符
        if(flag){
            //只修改运算符状态，不进行运算
            $(".numScreenSave").html($(".numScreenSave").html().substr(0,$(".numScreenSave").html().length-1) + "+");
            operate = 1;
            calcul = 1;
            return;
        }
        calculate(); //调用计算函数
        operate = 1; //更改输入状态
        calcul = 1; //更改计算状态为加
        commandSave();
    };

    // 减法
    excuteCalcu.minus = function() {

        if(flag){
            //只修改运算符状态，不进行运算
            $(".numScreenSave").html($(".numScreenSave").html().substr(0,$(".numScreenSave").html().length-1) + "-");
            operate = 1;
            calcul = 2;
            return;
        }
        calculate();
        operate = 1;
        calcul = 2;
        commandSave();
    };

    // 乘法
    excuteCalcu.times = function() {

        if(flag){
            //只修改运算符状态，不进行运算
            $(".numScreenSave").html($(".numScreenSave").html().substr(0,$(".numScreenSave").html().length-1) + "*");
            operate = 1;
            calcul = 3;
            return;
        }
        calculate();
        operate = 1;
        calcul = 3;
        commandSave();

    };

    // 除法
    excuteCalcu.divide = function() {

        if(flag){
            //只修改运算符状态，不进行运算
            $(".numScreenSave").html($(".numScreenSave").html().substr(0,$(".numScreenSave").html().length-1) + "/");
            operate = 1;
            calcul = 4;
            return;
        }
        calculate();
        operate = 1;
        calcul = 4;
        commandSave();
    };

    //等于
    excuteCalcu.equal = function() {

        //处理不规范按键问题
        var _saveText = $(".numScreenSave").html();
        if(_saveText.substring(_saveText.length - 1) === "="){
            return false;
        }

        if(_saveText.indexOf("+") ==-1 && _saveText.indexOf("-") ==-1 &&  _saveText.indexOf("*") ==-1 && _saveText.indexOf("/") ==-1 && _saveText.indexOf("%") ==-1){
            return false;
        }

        calculate();
        operate = 1;
        result = 0;
        numshow = "0";
        calcul = 0;
        commandSave();
        num = 0;

        $(".numScreen").focus();
        $(".numScreen").select();
    };

    // 清理小数点后的0
    var removeZeroForCal = function (numberStr) {
        var idx = numberStr.indexOf('.');
        if (idx !== -1) {

            var afterNumber = numberStr.substring(idx + 1);
            var size = afterNumber.length;
            for (var i = 0; i < size; i++) {
                if (afterNumber.lastIndexOf('0') === afterNumber.length - 1) {
                    afterNumber = afterNumber.substring(0, afterNumber.length - 1);
                }
                else {
                    break;
                }
            }

            var newNumber = numberStr.substring(0, idx) + '.' + afterNumber;
            if (newNumber.indexOf('.') === newNumber.length - 1) {
                return newNumber.substring(0, newNumber.length - 1);
            }
            return newNumber;
        }
        return numberStr;
    };


    // 执行计算
    var calculate = function() {

        numshow = new Number($(".numScreen").val());

        //处理第一个数为0的计算状态
        if(num !== 0){
            switch (calcul) { //判断要输入状态
                case 1:
                    var a = new BigDecimal(String(num));
                    var b = new BigDecimal(String(numshow));
                    result = a.add(b) + "";
                    break; //计算"+"
                case 2:
                    var a = new BigDecimal(String(num));
                    var b = new BigDecimal(String(numshow));
                    result = a.subtract(b) + "";
                    break; //计算"-"
                case 3:
                    var a = new BigDecimal(String(num));
                    var b = new BigDecimal(String(numshow));
                    result = a.multiply(b) + "";
                    break; //计算"*"
                case 4:
                    if (numshow != 0 && !isNaN(numshow)) {
                        var a = new BigDecimal(String(num));
                        var b = new BigDecimal(String(numshow));
                        result = parseFloat(a.divide(b,12,BigDecimal.ROUND_HALF_EVEN) + "");
                    } else {
                        result = "除数不能为零";
                    }
                    break; //计算"/"

            }

        }else{
            if(calcul == 2){
                var a = new BigDecimal(String(num));
                var b = new BigDecimal(String(numshow));
                result = a.subtract(b) + "";
            }else if(calcul == 3){
                var a = new BigDecimal(String(num));
                var b = new BigDecimal(String(numshow));
                result = a.multiply(b) + "";

            }else if(calcul == 4){
                if (numshow != 0 && !isNaN(numshow)) {
                    var a = new BigDecimal(String(num));
                    var b = new BigDecimal(String(numshow));
                    result = parseFloat(a.divide(b,12,BigDecimal.ROUND_HALF_EVEN) + "");
                } else {
                    result = "除数不能为零";
                }
            }else{
                result = parseFloat(num) + numshow;
            }

        }

        if(calcul == 0){
            numshow = String(result);
            $(".numScreen").val(result);
        }else{
            $(".numScreen").val(numshow);
        }
        num = result; //存储当前值

    };

    return {
        init:init
    }

})();