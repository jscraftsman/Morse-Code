(function () {
    $DELAY_BEFORE_TRANSMIT = 500;
    $DELAY_FOR_DASH = 150;
    $CODES = [];
  
    $MORSE_CODE = {
"01" : "A",
"1000" : "B",
"1010" : "C",
"100" : "D",
"0" : "E",
"0010" : "F",
"110" : "G",
"0000" : "H",
"00" : "I",
"0111" : "J",
"101" : "K",
"0100" : "L",
"11" : "M",
"10" : "N",
"111" : "O",
"0110" : "P",
"1101" : "Q",
"010" : "R",
"000" : "S",
"1" : "T",
"001" : "U",
"0001" : "V",
"011" : "W",
"1001" : "X",
"1011" : "Y",
"1100" : "Z",
"01111" : "1",
"00111" : "2",
"00011" : "3",
"00001" : "4",
"00000" : "5",
"10000" : "6",
"11000" : "7",
"11100" : "8",
"11110" : "9",
"11111" : "0"
};
    var element = document.getElementById('element'),
        status = document.getElementById('status'),
        stream = document.getElementById('stream'),
        start, end, 
        data = "",  
        diff,
        time = 0, timer;

    element.onmousedown = function () {
      start = +new Date();
      stopCount();
    };

    element.onmouseup = function () {
      end = +new Date();

      diff = end - start;
      
      data += diff > $DELAY_FOR_DASH ? '1' : '0';
      
      stream.innerHTML = data;
      status.innerHTML = "Mouse down time: " + diff + ' ms';
      
      startCount();
    };
  
function setList(){
  var code_sent = document.getElementById('codes_sent');
  var output = "";
  for(var i in $CODES){
      output += "<li>" + $CODES[i] + " - " + $MORSE_CODE[$CODES[i]] + "</li>";
  }
  code_sent.innerHTML = output;
  data = "";
}

function SendData(){
   //input.innerHTML="Send data";
   $CODES.push(data);
   setList();
   data = "";
   stream.innerHTML = "none";
}
  
function startCount(){
  timer=window.setTimeout(function(){
    time += 50;
    if(time > $DELAY_BEFORE_TRANSMIT){
        stopCount();
        SendData();
    }else{
      startCount();
    } 
  },50);
}

function stopCount(){
  time = 0;
  clearTimeout(timer);
}
  
  

})();