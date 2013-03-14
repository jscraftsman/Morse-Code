$(document).ready(function() {
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
              stream = document.getElementById('stream'),
              tdata = document.getElementById('tdata'),
              start, end, diff,
              data = "",  
              time = 0, timer;

          $("#sent").hide();
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
          
          $("#element").mouseover(function() {
               $("#element").addClass("glow");
          }).mouseout(function(){
               $("#element").removeClass("glow");
          });
          
          element.onmousedown = function () {
               start = +new Date();
               stopCount();
          };

          element.onmouseup = function () {
               end = +new Date();

               diff = end - start;

               data += diff > $DELAY_FOR_DASH ? '1' : '0';

               stream.innerHTML = data;
               tdata.innerHTML = getMorseCodeData();

               startCount();
          };

          function setList(){
               var code_sent = document.getElementById('codes_sent');
               var output = "";
               for(var i in $CODES){
                    output += "<li>" + $CODES[i] + " - " + ($MORSE_CODE[$CODES[i]] ? $MORSE_CODE[$CODES[i]] : "invalid code") + "</li>";
               }
               code_sent.innerHTML = output;
               data = "";
          }

          function SendData(){
               $CODES.push(data);
               setList();
               data = "";
               stream.innerHTML = "none";
               tdata.innerHTML = "none";
          }

          function startCount(){ timer=window.setTimeout(function(){ time += 50; if(time > $DELAY_BEFORE_TRANSMIT){ stopCount(); SendData(); }else{ startCount(); } },50); }
          function stopCount(){ time = 0; clearTimeout(timer); }
          function getMorseCodeData(){ return ($MORSE_CODE[data] ? $MORSE_CODE[data] : "none"); }

});
