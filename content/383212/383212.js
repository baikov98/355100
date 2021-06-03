﻿var content383212='<?xml version="1.0" encoding="UTF-8"?><page subtype="mixanswer" scrollable="false" pageload="script"><title>Подтверждение гипотез</title><content><script randomization="false"> <![CDATA[	function pageload() { try { if (typeof globalParam.ugolOtrGip==="undefined" || typeof globalParam.ugolPrelomGip==="undefined" || typeof globalParam.ugolPredelOtrGip==="undefined") { showCustomDialog("Необходимо обязательно сформулировать гипотезу. Заполните пропуски в тексте на сцене 3.1.", function() { showSlideById("383206"); }); return false; } else { return true; } } catch (e) { return true; }}function getAnswer(){for (var iv6sted in globalParam) { if (globalParam.hasOwnProperty(iv6sted)) {this[iv6sted]=globalParam[iv6sted]}}; if ((globalParam.ugolPredelOtrGip == "ugolPredelOtrGip_2" && globalParam.answer_2 == "answer2_1") || ((globalParam.ugolPredelOtrGip == "ugolPredelOtrGip_1" || globalParam.ugolPredelOtrGip == "ugolPredelOtrGip_3") && globalParam.answer_2 == "answer2_2"))  { return true; }		 else { return false; } }	function getResponse(){for (var iv6sted in globalParam) { if (globalParam.hasOwnProperty(iv6sted)) {this[iv6sted]=globalParam[iv6sted]}}; if (globalParam.ugolPredelOtrGip == "ugolPredelOtrGip_2" && globalParam.answer_2 == "answer2_2")  { return showCustomDialog("Неверно. Ваша гипотеза подтвердилась!"); }		 else if (globalParam.ugolPredelOtrGip == "ugolPredelOtrGip_2" && globalParam.answer_2 == "answer2_1") { return showCustomDialog("Верно. Ваша гипотеза подтвердилась!"); } else if ((globalParam.ugolPredelOtrGip == "ugolPredelOtrGip_1" || globalParam.ugolPredelOtrGip == "ugolPredelOtrGip_3") && globalParam.answer_2 == "answer2_2") { return showCustomDialog("Верно. Ваша гипотеза не подтвердилась!"); }  else if ((globalParam.ugolPredelOtrGip == "ugolPredelOtrGip_1" || globalParam.ugolPredelOtrGip == "ugolPredelOtrGip_3") && globalParam.answer_2 == "answer2_1") { return showCustomDialog("Неверно! Ваша гипотеза не подтвердилась! "); }  }]]></script><conditions> <p>По данным <a popup="dan11">таблицы</a> построен график зависимости предельного угла полного отражения от показателя преломления.</p> <figure align="center"> <object border="0" type="idiagram" width="800" height="280" file="425038/425038.js"/> </figure> <p>В начале работы вы выдвинули гипотезу:</p> <p>&#160;</p> <p><style type="quote">Свет выходит из среды с&#160;показателем <nobr>преломления <m>n</m> &#62; 1</nobr> в&#160;воздух. При&#160;увеличении&#160;<m>n</m> предельный угол полного отражения <write>globalParam.ugolPredelOtrGip</write>.</style></p> <p>&#160;</p> <p>Подтвердилась ли ваша гипотеза? <select id="answer_2"> <option value="answer2_1">Подтвердилась</option> <option value="answer2_2">Не подтвердилась</option> </select></p></conditions><mixanswer check="script" comment="script"></mixanswer><popup name="dan11" draggable="true"> <table> <tr><th><m>n</m><sub>1</sub></th><td><write>globalParam.opit2n11</write></td><td><write>globalParam.opit2n12</write></td><td><write>globalParam.opit2n13</write></td></tr> <tr><th>&#x03B1;<sub>0</sub></th><td><write>globalParam.alfa0Opit21</write></td><td><write>globalParam.alfa0Opit22</write></td><td><write>globalParam.alfa0Opit23</write></td></tr> </table></popup></content></page>';