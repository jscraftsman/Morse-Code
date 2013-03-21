$(document).ready(function() {
          $DELAY_BEFORE_TRANSMIT = 500;
          $DELAY_FOR_DASH = 150;
          $CODES = [];
          $ERROR_AT = parseInt($("#error-at").val());

          var element = document.getElementById('element'),
              stream = document.getElementById('stream'),
              tdata = document.getElementById('tdata'),
              start, end, diff,
              data = "",  
              time = 0, timer;

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

     /* socket io functions */
          var name = "";
          var address = location.href;
          var socket = io.connect(address);
          var received = $("#r-data");
          var error = "";
          var errorBit = 0;
          socket.on("connect", function(){
               do{
                    name = prompt("Enter name: ");
               }while(name==null);
               socket.emit("addUser", {name : name});
               
               socket.on("sentFromServer", function(data){
                    if(received.text()=="Empty"){
                         received.html("");
                    }
                    errorBit = getError(data["word"]); 
                    error = (errorBit != 0 ? ("<span style='color:red;'> [Error in Bit: "+errorBit+"]</span>") : "");
                    received.append(data["name"]+ ": "+data["word"]+ error+"<br />");       
               });
               socket.on("updateUsers", function(data){
                    var name = "";
                    for(i in data){
                         name += (i > 0 ? ", " : "");
                         name += data[i];
                    }
                    $("#users").text(name);
               });
          });

          $("#sent_toggle").click(function(){
                    $("#sent_toggle").text($("#codes_sent").is(":visible") ? "(show)" : "(hide)" );
                    $("#sent").toggle();
          });
          $("#clear_list").click(function(){
               if($("#codes_sent li").length > 0){
                    $CODES = [];
                    var code_sent = $("#codes_sent");
                    code_sent.html("Empty");
               }else{
                    alert("List is empty already!");
               }
          });
          $("#clear_r_list").click(function(){
               //clear data
               $("#r-data").html("Empty");
          });
          
          $("#element").mouseover(function() { $("#element").addClass("glow"); }).mouseout(function(){ $("#element").removeClass("glow"); }); 
          element.onmousedown = function () { handleMouseDown(); };
          element.onmouseup = function () { handleMouseUp(); };
          
          function handleMouseDown(){
               start = +new Date();
               stopCount();
          }
          function handleMouseUp(){
               end = +new Date();

               diff = end - start;

               data += diff > $DELAY_FOR_DASH ? '1' : '0';

               stream.innerHTML = data;
               tdata.innerHTML = getMorseCodeData();

               startCount();
          }

          function setDataLog(){
               var code_sent = document.getElementById('codes_sent');
               var output = "";
               for(var i in $CODES){
                    output += "<li>[ Input: " + $CODES[i] + " ] - [ Value: " + ($MORSE_CODE[$CODES[i]] ? $MORSE_CODE[$CODES[i]] : "invalid") + " ] - [ Encoded: " + encode($CODES[i]) + " ] - [ CHK: " + $MORSE_CODE[decode(encode($CODES[i]))] + " ]</li>";
                    //output += "<li>[ Input: " + $CODES[i] + " ] - [ Value: " + ($MORSE_CODE[$CODES[i]] ? $MORSE_CODE[$CODES[i]] : "invalid") + " ] - [ Encoded: " + encode($CODES[i]) + " ]</li>";
               }
               code_sent.innerHTML = output;
               data = "";
          }

          function getR(len){
               var r = 0;
               var left, right;
               do{
                    left = Math.pow(2, r) -r;
                    right = len + 1;
                    r++;
               }while(left < right);
               return (r-1);
          }
          function isBase2(n){
               return ((n & (n-1)) == 0);
          }
     
          function encode(data){
               var encodedData = "";
               var dataIndex = 0;
               var pIndex = 0;
               var bit = 0;
               var r = getR(data.length);
               var pValues = new Array(r);
               var t = 0;

               for(var i = 0; i < (data.length + r); i++){
                    if(isBase2(i+1)){
                         encodedData += "P";
                    }else{
                         encodedData += (""+data[dataIndex++]);
                    }
               }

               /////////////////////////////////////////  GET/GENERATE PARITY BITS ///////////////////////////////////////
               for(var p = 0; p < r; p++){
                    pValues[p] = 0;
                    for(var d = 0; d < encodedData.length; d++){
                         t = Math.pow(2, p); 
                         bit = parseInt(encodedData[d]);
                         if( ((d+1) != t) && ( (d+1) & t) ){
                              pValues[p] = pValues[p] ^ bit;
                         } 
                    }
               }
               
               pIndex = 0;
               //Generate new word
               for(var i = 0; i < (data.length + r);i++){
                    bit = parseInt(data[i]);
                    if(isBase2(i+1)){
                         encodedData = setCharAt(encodedData, i, pValues[pIndex++]);
                    } 
               }
               //create an error
               $ERROR_AT = parseInt($("#error-at").val());
               if(($ERROR_AT != 0)){
                    var eBit = parseInt(encodedData.charAt($ERROR_AT-1));
                    encodedData = setCharAt(encodedData, ($ERROR_AT-1), eBit == 0 ? '1' : '0');      
               }
               return encodedData;
          }

          //this is for sender only. to check if the encoded data is correct
          function decode(data){
               var decodedData = ""; 
               for(var i = 0; i < data.length;i++){
                    bit = parseInt(data[i]);
                    if(!isBase2(i+1)){
                         decodedData += (""+data[i]);
                    } 
               }
               return decodedData;
          }

          function getError(data){
               var e = 0;
               var bit = 0;
               var r = getR(data.length);
               var pValues = new Array(r);
               var t = 0;

               console.log("get error");
               ////////////////////////////////////////////  CHECK PARITY BITS  ///////////////////////////////////////////
               for(var p = 0; p < r; p++){
                    pValues[p] = 0;
                    for(var d = 0; d < data.length; d++){
                         t = Math.pow(2, p); 
                         bit = parseInt(data[d]);
                         if((d+1) & t){
                              console.log("P"+ t +": " + pValues[p] + " xor "+ bit + "[@bit: "+(d+1)+"]");//temp
                              pValues[p] = pValues[p] ^ bit;
                         } 
                    }
                    if(pValues[p] == 1){e += t; console.log("p: "+ p + ", e: "+ e + ", t:" + t);}
                    console.log("---");//temp
               }
               
               console.log("--------------------------------------");//temp
               console.log(pValues);//temp
               return e;
          }

          function setCharAt(str,index,chr) {
               if(index > str.length-1) return str;
               return str.substr(0,index) + chr + str.substr(index+1);
          }
          function prepareForSend(){
               if(data != ""){
                    socket.emit("sentFromClient", {data: encode(data)});
                    $CODES.push(data); //for log
                    setDataLog();
               }
               data = "";
               stream.innerHTML = "none";
               tdata.innerHTML = "none";
          }

          function startCount(){ 
               timer = window.setTimeout(function(){ 
                         time += 50;
                         if(time > $DELAY_BEFORE_TRANSMIT){
                              stopCount();
                              prepareForSend();
                         }else{
                              startCount();
                         }
               },50); 
          }
          function stopCount(){ time = 0; clearTimeout(timer); }
          function getMorseCodeData(){ return ($MORSE_CODE[data] ? $MORSE_CODE[data] : "none"); }

          
});
