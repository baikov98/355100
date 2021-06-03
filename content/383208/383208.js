﻿var content383208='<?xml version="1.0" encoding="UTF-8"?><page subtype="mixanswer" scrollable="false" pageload="script"><title>Подтверждение гипотез</title><content><script randomization="false"> <![CDATA[	function pageload() { try { if (typeof globalParam.ugolOtrGip==="undefined" || typeof globalParam.ugolPrelomGip==="undefined" || typeof globalParam.ugolPredelOtrGip==="undefined") { showCustomDialog("Необходимо обязательно сформулировать гипотезу. Заполните пропуски в тексте на сцене 3.1.", function() { showSlideById("383206"); }); return false; } else { return true; } } catch (e) { return true; }}function getAnswer(){for (var iv6sted in globalParam) { if (globalParam.hasOwnProperty(iv6sted)) {this[iv6sted]=globalParam[iv6sted]}}; if ((globalParam.ugolOtrGip == "ugolOtrGip_1" && globalParam.ugolPrelomGip == "ugolPrelomGip_1" && globalParam.answer_1 == "answer1_1") || ((globalParam.ugolOtrGip == "ugolOtrGip_2" || globalParam.ugolOtrGip == "ugolOtrGip_3")&& (globalParam.ugolPrelomGip == "ugolPrelomGip_2" || globalParam.ugolPrelomGip == "ugolPrelomGip_3") && globalParam.answer_1 == "answer1_2"))  { return true; }		 else { return false; } }	function getResponse(){for (var iv6sted in globalParam) { if (globalParam.hasOwnProperty(iv6sted)) {this[iv6sted]=globalParam[iv6sted]}}; if (globalParam.ugolOtrGip == "ugolOtrGip_1" && globalParam.ugolPrelomGip == "ugolPrelomGip_1" && globalParam.answer_1 == "answer1_2")  { return showCustomDialog("Неверно. Ваша гипотеза подтвердилась!"); }		 else if (globalParam.ugolOtrGip == "ugolOtrGip_1" && globalParam.ugolPrelomGip == "ugolPrelomGip_1" && globalParam.answer_1 == "answer1_1") { return showCustomDialog("Верно. Ваша гипотеза подтвердилась!"); } else if ((globalParam.ugolOtrGip == "ugolOtrGip_2" || globalParam.ugolOtrGip == "ugolOtrGip_3") && (globalParam.ugolPrelomGip == "ugolPrelomGip_2" || globalParam.ugolPrelomGip == "ugolPrelomGip_3") && globalParam.answer_1 == "answer1_2") { return showCustomDialog("Верно. Ваша гипотеза не подтвердилась!"); }  else if ((globalParam.ugolOtrGip == "ugolOtrGip_2" || globalParam.ugolOtrGip == "ugolOtrGip_3") && (globalParam.ugolPrelomGip == "ugolPrelomGip_2" || globalParam.ugolPrelomGip == "ugolPrelomGip_3") && globalParam.answer_1 == "answer1_1") { return showCustomDialog("Неверно! Ваша гипотеза не подтвердилась! "); }  }]]></script><conditions> <p>По данным <a popup="dan1">таблицы</a> построены <a popup="graf">графики</a> зависимости угла отражения и угла преломления от угла падения.</p> <p>&#160;</p> <p>В начале работы вы выдвинули гипотезу:</p> <p>&#160;</p> <p><style type="quote">При увеличении угла падения угол отражения <write>globalParam.ugolOtrGip</write>. При увеличении угла падения угол преломления <write>globalParam.ugolPrelomGip</write>.</style></p> <p>&#160;</p> <p>Подтвердилась ли ваша гипотеза? <select id="answer_1"> <option value="answer1_1">Подтвердилась</option> <option value="answer1_2">Не подтвердилась</option> </select></p></conditions><mixanswer check="script" comment="script"></mixanswer><popup name="dan1" draggable="true"> <table> <tr><th>&#x03B1;, &#x00B0;</th><td>5</td><td>15</td><td>25</td><td>35</td><td>45</td><td>55</td><td>65</td><td>75</td><td>85</td></tr> <tr><th>&#x03B2;, &#x00B0;</th><td><write>globalParam.betaOpit11</write></td><td><write>globalParam.betaOpit12</write></td><td><write>globalParam.betaOpit13</write></td><td><write>globalParam.betaOpit14</write></td><td><write>globalParam.betaOpit15</write></td><td><write>globalParam.betaOpit16</write></td><td><write>globalParam.betaOpit17</write></td> <td><write>globalParam.betaOpit18</write></td><td><write>globalParam.betaOpit19</write></td></tr> <tr><th>&#x03B3;, &#x00B0;</th><td><write>globalParam.gamaOpit11</write></td><td><write>globalParam.gamaOpit12</write></td><td><write>globalParam.gamaOpit13</write></td><td><write>globalParam.gamaOpit14</write></td><td><write>globalParam.gamaOpit15</write></td><td><write>globalParam.gamaOpit16</write></td><td><write>globalParam.gamaOpit17</write></td> <td><write>globalParam.gamaOpit18</write></td><td><write>globalParam.gamaOpit19</write></td></tr> </table></popup><popup name="graf" width="840" draggable="true"> <tabs width="800" height="300"> <figure> <caption>Угол отражения</caption> <asset> <figure align="center"> <object border="0" type="idiagram" width="800" height="280" file="425036/425036.js"/> </figure> </asset> </figure> <figure> <caption>Угол преломления</caption> <asset> <figure align="center"> <object border="0" type="idiagram" width="800" height="280" file="425037/425037.js"/> </figure> </asset> </figure> </tabs></popup></content></page>';