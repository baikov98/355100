//Отражение и преломление света
function ReflectionRefractionLight(xmlData, wrapper, basePath, params) {
    var model;

    this.init = function () {
        model = new modelNS.ReflectionRefractionLight({
            xmlData: xmlData,
            wrapper: wrapper,
            basePath: basePath,
            restyling: "title",
            // scalable: false,
            // defaults: {},
            width: wrapper.data('width'),
            height: wrapper.data('height'),
            params: params
        });
        return new modelNS.ReflectionRefractionLightView({ model: model }).renderOnShow();
    };
}

modelNS.CommonModel.models.reflectionRefractionLight = ReflectionRefractionLight;

modelNS.addLangs({
    ru: {
        animation: 'Анимация',
        experiment: 'Эксперимент',
        initialParameters: 'Исходные параметры',
        outputWindow: 'Окно вывода',
        angleParameters: 'Угол падения',
        angles: 'Углы',
        refractiveIndexParameters: 'Показатели преломления',
        refractiveIndexParameters1: 'Показатель преломления n₁',
        refractiveIndexParameters2: 'Показатель преломления n₂',
        angleIncidence: 'Угол падения',
        totalInternalReflectionAngle: 'Угол полного внутреннего отражения',
        ReflectionAngle: 'Угол отражения',
        RefractionAngle: 'Угол преломления',
        fullReflectionPossible: 'Полное внутреннее отражение возможно',
        fullReflectionImpossible: 'Полное внутреннее отражение невозможно',
        totalInternalReflectionIsObserved: 'Наблюдается полное внутреннее отражение',
    }
});

modelNS.ReflectionRefractionLight = modelNS.BaseModel.extend({
    initialize: function (options) {
        modelNS.BaseModel.prototype.initialize.apply(this, arguments);
    },
});

modelNS.ReflectionRefractionLightView = modelNS.BaseModelView.extend({
    initialize: function () {
        modelNS.BaseModelView.prototype.initialize.apply(this, arguments);
    },
    render: function () {
        modelNS.BaseModelView.prototype.render.apply(this);
        this.$el.addClass('reflectionRefractionLight');
        this.renderParams();
        this.renderLayout();
        this.renderFunc();
        this.renderCanvas();
        this.renderSvg();
        this.renderControls();
        this.renderDefaults();
        this.renderListener();
    },

    renderParams: function () {
        var self = this;
        window.RRL = self; // для доступа из глобального объекта window

        self.defaults = {}; // стартовые значения
        self.help = {}; // подсказки
        self.control = {}; // элементы управления
        self.label = {};

        self.canvas = {};

        self.svg = {};
        self.svg.static = {}; // статические элементы
        self.svg.dynamic = {}; // динамические элементы

        self.kit = { help: 'kit of values' };
        self.kit.r = { help: 'radius' };
        self.kit.ls = { help: 'lightSpeed' };
        self.kit.arrowHead = { help: 'arrowHead (наконечник)' };
        self.kit.nInputs = { help: 'инпуты для параметров приломления' };
        self.func = { help: 'functions' };

        self.help['kit'] = 'kit of values';
        self.help['kit.angleFullRefLect'] = 'angle full reflection';
        self.help['kit.r'] = 'radiuses';
        self.help['kit.r.semicircle'] = 'радиус полукруга';
        self.help['kit.r.laserJet'] = 'радиус, откуда рисуется свет из лазера (больше радиуса полукруга)';
        self.help['kit.ls'] = 'lightSpeed';
        self.help['func'] = 'functions';

        self.kit.alpha = 'α';
        self.kit.beta = 'β';
        self.kit.gamma = 'γ';
        self.kit.gammaValue = 0
        self.kit.width = 1000;
        self.kit.rayColor = '#FF9900';
        self.kit.fontSize = self.kit.width / 20;
        self.kit.fontSizeSub = self.kit.fontSize * 0.58;
        self.kit.lineWidth = self.kit.width / 500;
        self.kit.strokeWidth = self.kit.width / 200;
        self.kit.arrowHead.angle = 10;
        self.kit.arrowHead.length = self.kit.width / 40;

        self.kit.ls.laserMove = 250;
        self.kit.ls.rayMove = 200;
        self.kit.ls.rayFade = 50;

        self.kit.r.semicircle = +(self.kit.width / 3).toFixed(3); // радиус полукруга
        self.kit.r.laserJet = +self.kit.r.semicircle + 4; // радиус, откуда рисуется свет из лазера (больше радиуса полукруга)
        self.kit.r.arcLaser = self.kit.width / 4.6; // арка лазера
        self.kit.r.arcRefLect = self.kit.width / 6; // арка отражения
        self.kit.r.arcRefRact1 = self.kit.width / 5; // арка приломленного луча 1
        self.kit.r.arcRefRact2 = self.kit.width / 5.1; // арка приломленного луча 2
        self.kit.r.textFullRefLect = self.kit.width / 30; // текст угла полного отражения
        self.kit.r.textLaser = self.kit.r.arcLaser / 0.95; // text лазера
        self.kit.r.textRefLect = self.kit.r.arcRefLect / 0.95; // text отражения
        self.kit.r.textRefRact = self.kit.r.arcRefRact1 / 0.85; // text приломленного луча

        self.kit.nInputs.step = 0.01;
        self.kit.nInputs.min = 1;
        self.kit.nInputs.max = 3;

        self.defaults = {
            angle: '30.0',
            n1: 1.6,
            n2: 1,
        };
    },

    renderFunc: function () {
        var self = this;
        self.func.radToDeg = function (rad) {
            return rad / Math.PI * 180;
        };
        self.func.degToRad = function (deg) {
            return deg / 180 * Math.PI;
        };
        self.func.polarToCartesian = function (centerX, centerY, radius, angleInDegrees) {
            var angleInRadians = (angleInDegrees - 90) * Math.PI / 180;
            return {
                x: (centerX + (radius * Math.cos(angleInRadians))).toFixed(3),
                y: (centerY + (radius * Math.sin(angleInRadians))).toFixed(3),
            };
        };
        self.func.describeArc = function (x, y, radius, startAngle, endAngle) {
            var start = self.func.polarToCartesian(x, y, radius, endAngle);
            var end = self.func.polarToCartesian(x, y, radius, startAngle);
            var largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
            radius = +radius.toFixed(3);
            return [
                'M', start.x, start.y,
                'A', radius, radius, 0, largeArcFlag, 0, end.x, end.y
            ].join(' ');
        };
        self.func.angleFromCoords = function (type, x, y, callback) {
            // var zoom = self.el.style.zoom;
            var zoom = courseML.zoomScale;
            var zoomX = x / zoom;
            var zoomY = y / zoom;
            var clientRect = self.svg.svg.node().getBoundingClientRect();
            var width = clientRect.width;
            var height = clientRect.height;
            var dx = zoomX - clientRect.x - width / 2;
            var dy = height / 2 - zoomY + clientRect.y;
            if (dx >= 0 && dx <= width / 2 && dy >= 0 && dy <= height / 2) {
                callback(Math.atan2(dx, dy) / Math.PI * 180);
            }
        };
        self.func.moveText = function (textName, angle, drag) {
            var width = self.kit.width;
            var text = self.svg.dynamic[textName];
            var radius = self.kit.r[textName];
            console.log(textName, angle, drag)
            var shiftX = 0
            if (textName === 'textLaser' && angle < 6.314) {
                shiftX = 30
            } else if (textName === 'textRefLect' && angle > -1.315) {
                shiftX = -30
            } else if (textName === 'textRefRact' && angle < 182.2) {
                shiftX = -30
            }
            var coordsText = self.func.polarToCartesian((width / 2) + shiftX, width / 2, radius, angle);
            if (drag) {
                text.attr('x', coordsText.x).attr('y', coordsText.y);
                return;
            }
            text
                .transition().delay(0).duration(self.kit.ls.laserMove).ease(d3.easeLinear)
                .attr('x', coordsText.x).attr('y', coordsText.y);
        };
        self.func.moveArc = function (arcName, angleStart, angleEnd, drag) {
            var width = self.kit.width;
            var arc = self.svg.dynamic[arcName];
            var radius = self.kit.r[arcName];
            var d = self.func.describeArc(width / 2, width / 2, radius, angleStart, angleEnd);

            if (drag) {
                arc
                    .attr('d', d);
                return;
            }
            arc
                .transition().delay(0).duration(self.kit.ls.laserMove).ease(d3.easeLinear)
                .attr('d', d);
        };
        self.func.moveArrow = function (arrowName, angle, opacity, drag) {
            var width = self.kit.width;
            var arrow = self.svg.dynamic[arrowName];
            var grad = self.svg.dynamic[arrowName + 'LGrad'];
            var stop1 = self.svg.dynamic[arrowName + 'LGradStop1'];
            var stop2 = self.svg.dynamic[arrowName + 'LGradStop2'];
            angle = angle || 0
            
            var coordOnArc = self.func.polarToCartesian(width / 2, width / 2, self.kit.r.semicircle, angle);
            var coordsArrowHead1 = self.func.polarToCartesian(
                +coordOnArc.x, +coordOnArc.y, self.kit.arrowHead.length, angle + 180 - self.kit.arrowHead.angle);
            var coordsArrowHead2 = self.func.polarToCartesian(
                +coordOnArc.x, +coordOnArc.y, self.kit.arrowHead.length, angle + 180 + self.kit.arrowHead.angle);

            var stopPos = stop1.attr('offset');
            var d = ['M', width / 2, width / 2, 'L', coordOnArc.x, coordOnArc.y,
                coordsArrowHead1.x, coordsArrowHead1.y, coordsArrowHead2.x, coordsArrowHead2.y,
                coordOnArc.x, coordOnArc.y].join(' ');

            var times = [
                { de: self.kit.ls.rayFade, du: 0, },
                { de: 0, du: self.kit.ls.rayFade, },
                { de: 0, du: 0, },
                { de: self.kit.ls.laserMove - 2 * self.kit.ls.rayFade + self.kit.ls.rayMove, du: self.kit.ls.rayMove, },
                { de: 0, du: 0, },
            ];

            if (drag) {
                arrow.attr('d', d);
                grad.interrupt().attr('x2', coordOnArc.x).attr('y2', coordOnArc.y);
                stop1.interrupt().attr('offset', 1).attr('stop-opacity', opacity);
                stop2.interrupt().attr('offset', 1).attr('stop-opacity', opacity);
                return;
            }
            arrow
                .transition().delay(self.kit.ls.rayFade * 2).duration(0).ease(d3.easeLinear)
                .attr('d', d);
            grad
                .transition().delay(self.kit.ls.rayFade * 2).duration(0).ease(d3.easeLinear)
                .attr('x2', coordOnArc.x).attr('y2', coordOnArc.y);
            stop1
                .transition().delay(times[0].de).duration(times[0].du).ease(d3.easeLinear)
                .attr('offset', stopPos).attr('stop-opacity', 0)
                .transition().delay(times[1].de).duration(times[1].du).ease(d3.easeLinear)
                .attr('offset', 1)
                .transition().delay(times[2].de).duration(times[2].du).ease(d3.easeLinear)
                .attr('offset', 0).attr('stop-opacity', opacity)
                .transition().delay(times[3].de).duration(times[3].du).ease(d3.easeLinear)
                .attr('offset', 1).attr('stop-opacity', opacity)
                .transition().delay(times[4].de).duration(times[4].du).ease(d3.easeLinear)
                .attr('offset', 0).attr('stop-opacity', opacity);
            stop2
                .transition().delay(times[0].de).duration(times[0].du).ease(d3.easeLinear)
                .attr('offset', stopPos)
                .transition().delay(times[1].de).duration(times[1].du).ease(d3.easeLinear)
                .attr('offset', 1)
                .transition().delay(times[2].de).duration(times[2].du).ease(d3.easeLinear)
                .attr('offset', 0).attr('stop-opacity', 0)
                .transition().delay(times[3].de).duration(times[3].du).ease(d3.easeLinear)
                .attr('offset', 1).attr('stop-opacity', 0)
                .transition().delay(times[4].de).duration(times[4].du).ease(d3.easeLinear)
                .attr('offset', 0).attr('stop-opacity', opacity);
        };
        self.func.moveLaser = function (angle, drag) {
            var width = self.kit.width;
            var $divLaser = self.canvas.$divLaser;

            var n1T = self.control.n1Input.getText();
            var n2T = self.control.n2Input.getText();
            
            var refRactRadVal = Math.asin((n1T/n2T)*Math.sin(self.func.degToRad(angle)))
            
            var refRactAngle = +self.func.radToDeg(refRactRadVal)// || 0 // 90 / self.kit.angleFullRefLect * angle;

            self.label.angleRefRact.set({ d: String(refRactAngle.toFixed(1)).replace('.',',') }); // угол преломления // 
            self.kit.gammaValue = refRactAngle
            self.func.changeAngleRefRactStatus();
            self.func.changeRefLectStatus();

            $divLaser.stop();
            $divLaser.animate({ test: angle }, {
                step: function (now) {
                    $(this).css('transform', 'rotate(' + now + 'deg)');
                },
                duration: drag ? 0 : self.kit.ls.laserMove,
                easing: 'linear',
                done: function (obj) {
                    if (obj.props.test !== undefined) {
                    }
                },
            });

            var refLectOpacity = 1 / self.kit.angleFullRefLect * angle;
            var refRactOpacity = 1 - 1 / self.kit.angleFullRefLect * angle;

            var visibleRefRact = (refRactOpacity > 0);
            
            var coordsRay = self.func.polarToCartesian(width / 2, width / 2, self.kit.r.laserJet, angle);
            var stopPos = self.svg.dynamic.lineLiserLGradStop1.attr('offset');

            var times = [
                { de: 0, du: 0, },
                { de: 0, du: self.kit.ls.rayFade, },
                { de: self.kit.ls.laserMove - self.kit.ls.rayFade, du: 0, },
                { de: 0, du: self.kit.ls.rayMove, },
                { de: 0, du: 0, },
            ];

            if (visibleRefRact) {
                self.svg.dynamic.arcRefRact1.style('opacity', '1');
                self.svg.dynamic.arcRefRact2.style('opacity', '1');
                self.svg.dynamic.textRefRact.style('opacity', '1');

                self.func.moveArc('arcRefRact1', 180, 180 + refRactAngle, drag);
                self.func.moveArc('arcRefRact2', 180, 180 + refRactAngle, drag);
                self.func.moveText('textRefRact', refRactAngle / 2 + 177, drag);
            } else {
                self.svg.dynamic.arcRefRact1.style('opacity', '0');
                self.svg.dynamic.arcRefRact2.style('opacity', '0');
                self.svg.dynamic.textRefRact.style('opacity', '0');
            }

            self.func.moveArrow('arrowRefLect', -angle, refLectOpacity, drag);
            self.func.moveArrow('arrowRefRact', 180 + refRactAngle, refRactOpacity, drag);

            self.func.moveArc('arcLaser', 0, angle, drag);
            self.func.moveArc('arcRefLect', -angle, 0, drag);

            self.func.moveText('textLaser', angle / 2, drag);
            self.func.moveText('textRefLect', -angle / 2 + 5, drag);

            if (drag) {
                self.svg.dynamic.lineLiser.attr('x1', coordsRay.x).attr('y1', coordsRay.y);
                self.svg.dynamic.lineLiserLGrad.interrupt().attr('x1', coordsRay.x).attr('y1', coordsRay.y);
                self.svg.dynamic.lineLiserLGradStop1.interrupt().attr('offset', 0).attr('stop-opacity', 1);
                self.svg.dynamic.lineLiserLGradStop2.interrupt().attr('offset', 0).attr('stop-opacity', 1);
                return;
            }
            self.svg.dynamic.lineLiser
                .transition().delay(self.kit.ls.rayFade).duration(0).ease(d3.easeLinear)
                .attr('x1', coordsRay.x).attr('y1', coordsRay.y);
            self.svg.dynamic.lineLiserLGrad
                .transition().delay(self.kit.ls.rayFade).duration(0).ease(d3.easeLinear)
                .attr('x1', coordsRay.x).attr('y1', coordsRay.y);
            self.svg.dynamic.lineLiserLGradStop1
                .transition().delay(times[0].de).duration(times[0].du).ease(d3.easeLinear)
                .attr('offset', stopPos).attr('stop-opacity', 0)
                .transition().delay(times[1].de).duration(times[1].du).ease(d3.easeLinear)
                .attr('offset', 1).attr('stop-opacity', 0)
                .transition().delay(times[2].de).duration(times[2].du).ease(d3.easeLinear)
                .attr('offset', 0).attr('stop-opacity', 1)
                .transition().delay(times[3].de).duration(times[3].du).ease(d3.easeLinear)
                .attr('offset', 1).attr('stop-opacity', 1)
                .transition().delay(times[4].de).duration(times[4].du).ease(d3.easeLinear)
                .attr('offset', 0).attr('stop-opacity', 1);
            self.svg.dynamic.lineLiserLGradStop2
                .transition().delay(times[0].de).duration(times[0].du).ease(d3.easeLinear)
                .attr('offset', stopPos).attr('stop-opacity', 1)
                .transition().delay(times[1].de).duration(times[1].du).ease(d3.easeLinear)
                .attr('offset', 1).attr('stop-opacity', 1)
                .transition().delay(times[2].de).duration(times[2].du).ease(d3.easeLinear)
                .attr('offset', 0).attr('stop-opacity', 0)
                .transition().delay(times[3].de).duration(times[3].du).ease(d3.easeLinear)
                .attr('offset', 1).attr('stop-opacity', 0)
                .transition().delay(times[4].de).duration(times[4].du).ease(d3.easeLinear)
                .attr('offset', 0).attr('stop-opacity', 1);
        };
        self.func.changeOpacityN1 = function () {
            var rect = self.svg.static.rectTop;
            var n1T = self.control.n1Input.getText();
            var n2T = self.control.n2Input.getText();
            var colorDiff = n1T > n2T ? n2T / n1T : n1T / n2T
            var opacity = 1 - colorDiff;
            rect.style('opacity', opacity + '');
        };
        self.func.changeAngleFullRefLect = function () {
            var n1T = self.control.n1Input.getText();
            var n2T = self.control.n2Input.getText();
            // angle full reflection
            var asinValue = n1T > n2T ? Math.asin(n2T / n1T) : Math.PI/2 //Math.asin(n1T / n2T)
            self.kit.angleFullRefLect = self.func.radToDeg(asinValue);
            var roundedNum = self.kit.angleFullRefLect.toFixed(1)
            var strFormattedVal = String(roundedNum).replace('.',',')
            self.label.angleFullRefLect.set({ d: strFormattedVal });
        };

        self.func.changeAngleRefLect = function () {
            var angle = +self.control.angleInput.getText()
            var strFormattedVal = String(angle.toFixed(1)).replace('.',',')
            self.label.angleRefLect.set({ d: strFormattedVal });
        };

        self.func.changeRefLectStatus = function () {
            var n1 = +self.control.n1Input.getText();
            var n2 = +self.control.n2Input.getText();
            if (n2 >= n1) {
                self.label.refLectStatus.set({ d: modelNS.lang('fullReflectionImpossible') });
                self.label.angleFullRefLect.$el.addClass('hidden')
            }
            if (n2 < n1) {
                self.label.refLectStatus.set({ d: modelNS.lang('fullReflectionPossible') });
                self.label.angleFullRefLect.$el.removeClass('hidden')
            }
            if (!self.kit.gammaValue && self.kit.gammaValue !== 0 && n2 < n1) {
                self.label.refLectStatus.$el.addClass('hidden')
            } else {
                self.label.refLectStatus.$el.removeClass('hidden')
            }

        };

        self.func.changeAngleRefRactStatus = function () {
            var n1 = +self.control.n1Input.getText();
            var n2 = +self.control.n2Input.getText();

            if (!self.kit.gammaValue && self.kit.gammaValue !== 0 && n2 < n1) {
                self.label.angleRefRact.$el.addClass('hidden')
                self.label.refRactStatus.$el.removeClass('hidden')
            } else {
                self.label.angleRefRact.$el.removeClass('hidden')
                self.label.refRactStatus.$el.addClass('hidden')
            } 
        };

    },

    renderLayout: function () {
        this.layout = {};
        var containerWidth = this.$el.width();
        var containerHeight = this.$el.height();

        this.layout.level1 = new modelNS.DualVerticalLayout({
            firstPaneWidth: 600,//400
            secondPaneWidth: 300,//500
            parent: this.$el,
        }).render();

        this.layout.animationPane = new modelNS.SingleLayout({
            title: modelNS.lang('experiment'),
            parent: this.layout.level1.$firstPane,
            hasContent: true,
            hasPadding: false,
            nopadding: true,
            columns: 1,
            cls: 'animation',
        }).render();

        this.layout.level2 = new modelNS.DualHorizontalLayout({
            parent: this.layout.level1.$secondPane,
            topPaneHeight: 285,
        }).render();

        this.layout.level3 = new modelNS.DualHorizontalLayout({
            parent: this.layout.level2.$topPane,
            topPaneHeight: 160,
        }).render();

        this.layout.angleParameters = new modelNS.SingleLayout({
            title: modelNS.lang('angleParameters'),
            parent: this.layout.level3.$topPane,
            hasContent: true,
            columns: 1,
            cls: 'angleParameters',
        }).render();

        this.layout.refractiveIndexParameters = new modelNS.SingleLayout({
            title: modelNS.lang('refractiveIndexParameters'),
            parent: this.layout.level3.$bottomPane,
            hasContent: true,
            columns: 1,
            cls: 'refractiveIndexParameters',
        }).render();
        
        this.layout.anglesText = new modelNS.SingleLayout({
            title: modelNS.lang('angles'),
            parent: this.layout.level2.$bottomPane,
            hasContent: true,
            columns: 1,
            cls: 'angles',
        }).render();

    },

    renderCanvas: function () {
        var self = this;

        var $divLaser = $('<div class="laser"></div>').appendTo(self.layout.animationPane.$content);
        var $canvasLaser = $('<canvas class="canvasLaser" />').appendTo($divLaser);
        $canvasLaser.attr('width', lib.properties.width).attr('height', lib.properties.height);
        var exportRoot = new lib.laser1();
        var stage = new createjs.Stage($canvasLaser[0]);
        stage.addChild(exportRoot);
        stage.update();
        $canvasLaser.data({ exportRoot: exportRoot, stage: stage });
        var heightLayot = self.layout.level1.$el[0].clientHeight;
        self.canvas.$canvasLaser = $canvasLaser;

        $divLaser.css({ height: heightLayot / 2 });
        self.canvas.$divLaser = $divLaser;
    },

    renderSvg: function () { // использую библиотеку D3js
        var self = this;
        var width = self.kit.width;
        var heightLayot = self.layout.level1.$el[0].clientHeight;
        var textLaserCoords = self.func.polarToCartesian(width / 2, width / 2, self.kit.r.textLaser, 0);
        var textRefLectCoords = self.func.polarToCartesian(width / 2, width / 2, self.kit.r.textLaser, 0);
        var textRefRactCoords = self.func.polarToCartesian(width / 2, width / 2, self.kit.r.textRefRact, 180);

        self.svg.svg = d3.select(self.layout.animationPane.$content[0]).append('svg').attr('id', 'svg')
            .style('width', '100%')
            .style('height', heightLayot + 'px')
            .attr('viewBox', ['0 0', self.kit.width, self.kit.width].join(' ')).style('overflow', 'hidden');

        self.svg.static.g = self.svg.svg.append('g').attr('id', 'static');
        self.svg.static.rectTop = self.svg.static.g.append('path').attr('id', 'rectTop')
            .attr('d', ['M', -100, -100, 'L', width + 100, -100, 'L', width + 100, width / 2, 'L', -100, width / 2, 'Z'].join(' '))
            .attr('fill', '#b6b6ff').style('opacity', '0.3');
        self.svg.static.vertLine = self.svg.static.g.append('line').attr('id', 'vertLine')
            .attr('stroke', 'black').attr('x1', '50%').attr('y1', '-100').attr('x2', '50%').attr('y2', +width + 100 + '')
            .attr('stroke-dasharray', [3 * self.kit.lineWidth, 1.5 * self.kit.lineWidth, self.kit.lineWidth, 1.5 * self.kit.lineWidth].join(' '))
            .attr('stroke-width', self.kit.lineWidth);
        self.svg.static.horLine = self.svg.static.g.append('line').attr('id', 'horLine')
            .attr('stroke', 'black').attr('x1', '-100').attr('y1', '50%').attr('x2', +width + 100 + '').attr('y2', '50%')
            .attr('stroke-width', self.kit.lineWidth);

        self.svg.static.textN1 = self.svg.static.g.append('text').attr('id', 'textN1').attr('x', '5%').attr('y', '5%')
            .attr('font-size', self.kit.fontSize);
        self.svg.static.textN1.append('tspan').text('n').classed('italicText', true);
        self.svg.static.textN1Ind = self.svg.static.g.append('text').attr('id', 'textN1Ind').attr('x', '8%').attr('y', '6%')
            .attr('font-size', self.kit.fontSizeSub).text('1');

        self.svg.static.textN2 = self.svg.static.g.append('text').attr('id', 'textN2').attr('x', '5%').attr('y', '55%')
            .attr('font-size', self.kit.fontSize).classed('italicText', true);
        self.svg.static.textN2.append('tspan').text('n').classed('italicText', true);
        self.svg.static.textN2Ind = self.svg.static.g.append('text').attr('id', 'textN2Ind').attr('x', '8%').attr('y', '56%')
            .attr('font-size', self.kit.fontSizeSub).text('2');


        // self.svg.dynamic
        self.svg.dynamic.g = self.svg.svg.append('g').attr('id', 'dynamic');

        self.svg.dynamic.lineLiserLGrad = self.svg.dynamic.g.append('linearGradient').attr('id', 'lineLiserLGrad')
            .attr('x1', width / 2).attr('y1', width / 2).attr('x2', width / 2).attr('y2', width / 2)
            .attr('gradientUnits', 'userSpaceOnUse');
        self.svg.dynamic.lineLiserLGradStop1 = self.svg.dynamic.lineLiserLGrad.append('stop')
            .attr('offset', 1).attr('stop-color', self.kit.rayColor).attr('stop-opacity', 0);
        self.svg.dynamic.lineLiserLGradStop2 = self.svg.dynamic.lineLiserLGrad.append('stop')
            .attr('offset', 1).attr('stop-color', self.kit.rayColor).attr('stop-opacity', 0);

        self.svg.dynamic.lineLiser = self.svg.dynamic.g.append('line').attr('id', 'lineLiser')
            .classed('laserLight', true).attr('stroke', 'black').attr('stroke-width', self.kit.strokeWidth)
            .attr('x1', width / 2).attr('y1', width / 2).attr('x2', width / 2).attr('y2', width / 2)
            .attr('stroke', 'url(#lineLiserLGrad)');

        self.svg.dynamic.arrowRefLectLGrad = self.svg.dynamic.g.append('linearGradient').attr('id', 'arrowRefLectLGrad')
            .attr('x1', width / 2).attr('y1', width / 2).attr('x2', width / 2).attr('y2', width / 2 - self.kit.r.semicircle)
            .attr('gradientUnits', 'userSpaceOnUse');
        self.svg.dynamic.arrowRefLectLGradStop1 = self.svg.dynamic.arrowRefLectLGrad.append('stop')
            .attr('offset', 1).attr('stop-color', self.kit.rayColor).attr('stop-opacity', 0);
        self.svg.dynamic.arrowRefLectLGradStop2 = self.svg.dynamic.arrowRefLectLGrad.append('stop')
            .attr('offset', 1).attr('stop-color', self.kit.rayColor).attr('stop-opacity', 0);

        self.svg.dynamic.arrowRefLect = self.svg.dynamic.g.append('path').attr('id', 'arrowRefLect')
            .classed('laserLight', true).attr('stroke', 'black').attr('stroke-width', self.kit.strokeWidth)
            .attr('stroke', 'url(#arrowRefLectLGrad)');

        self.svg.dynamic.arrowRefRactLGrad = self.svg.dynamic.g.append('linearGradient').attr('id', 'arrowRefRactLGrad')
            .attr('x1', width / 2).attr('y1', width / 2).attr('x2', width / 2).attr('y2', width / 2 - self.kit.r.semicircle)
            .attr('gradientUnits', 'userSpaceOnUse');
        self.svg.dynamic.arrowRefRactLGradStop1 = self.svg.dynamic.arrowRefRactLGrad.append('stop')
            .attr('offset', 1).attr('stop-color', self.kit.rayColor).attr('stop-opacity', 0);
        self.svg.dynamic.arrowRefRactLGradStop2 = self.svg.dynamic.arrowRefRactLGrad.append('stop')
            .attr('offset', 1).attr('stop-color', self.kit.rayColor).attr('stop-opacity', 0);

        self.svg.dynamic.arrowRefRact = self.svg.dynamic.g.append('path').attr('id', 'arrowRefRact')
            .classed('laserLight', true).attr('stroke', 'black').attr('stroke-width', self.kit.strokeWidth)
            .attr('stroke', 'url(#arrowRefRactLGrad)');

        self.svg.dynamic.arcLaser = self.svg.dynamic.g.append('path').attr('id', 'arcLaser')
            .attr('fill', 'none').attr('stroke', '#000').attr('stroke-width', self.kit.lineWidth)
            .attr('d', self.func.describeArc(width / 2, width / 2, self.kit.r.arcLaser, 0, 0));
        self.svg.dynamic.arcRefLect = self.svg.dynamic.g.append('path').attr('id', 'arcRefLect')
            .attr('fill', 'none').attr('stroke', '#000').attr('stroke-width', self.kit.lineWidth)
            .attr('d', self.func.describeArc(width / 2, width / 2, self.kit.r.arcRefLect, 0, 0));
        self.svg.dynamic.arcRefRact1 = self.svg.dynamic.g.append('path').attr('id', 'arcRefRact1')
            .attr('fill', 'none').attr('stroke', '#000').attr('stroke-width', self.kit.lineWidth)
            .attr('d', self.func.describeArc(width / 2, width / 2, self.kit.r.arcRefRact1, 180, 180));
        self.svg.dynamic.arcRefRact2 = self.svg.dynamic.g.append('path').attr('id', 'arcRefRact2')
            .attr('fill', 'none').attr('stroke', '#000').attr('stroke-width', self.kit.lineWidth)
            .attr('d', self.func.describeArc(width / 2, width / 2, self.kit.r.arcRefRact2, 180, 180));

        self.svg.dynamic.textLaser = self.svg.dynamic.g.append('text').attr('id', 'textLaser')
            .classed('litera', true).text(self.kit.alpha).attr('font-size', self.kit.fontSize)
            .classed('georgia', true)
            .attr('x', textLaserCoords.x).attr('y', textLaserCoords.y)
            .attr('text-anchor', 'middle');
        self.svg.dynamic.textRefLect = self.svg.dynamic.g.append('text').attr('id', 'textRefLect')
            .classed('litera', true).text(self.kit.beta).attr('font-size', self.kit.fontSize)
            .classed('georgia', true)
            .attr('x', textRefLectCoords.x).attr('y', textRefLectCoords.y)
            .attr('text-anchor', 'end');
        self.svg.dynamic.textRefRact = self.svg.dynamic.g.append('text').attr('id', 'textRefRact')
            .classed('litera', true).text(self.kit.gamma).attr('font-size', self.kit.fontSize)
            .classed('georgia', true)
            .attr('x', textRefRactCoords.x).attr('y', textRefRactCoords.y)
            .attr('text-anchor', 'end');
    },

    renderControls: function () {
        var self = this;
        self.control.angleInput = new modelNS.Input({
            parent: self.layout.angleParameters.$content,
            value: self.defaults.angle,
            step: 0.1,
            min: 0,
            max: 90,
            inputType: 'number',
            width: 200,
            label: '<span class="georgia">&alpha;</span> = ',
            labelAfter: '<span class="deg">&deg;</span>',
            title: modelNS.lang('angleIncidence'),
            row: true
        }).render();

        var datas = [];
        for (var i = 0; i <= 90; i += 1) {
            if ([0, 30, 60, 90].indexOf(i) >= 0) {
                datas.push(i + '&deg;');
            } else if (i % 10 === 0) {
                datas.push(' ');
            } else {
                datas.push('')
            }
        }
        self.control.angleSlide = new modelNS.HorizontalSlider({
            model: new modelNS.HorizontalSliderModel({
                parent: self.layout.angleParameters.$content,
                addClass: 'mark-has-deg',
                min: 0,
                max: datas.length,
                dates: datas,
                value: self.defaults.angle,
                title: modelNS.lang('angleIncidence'),
            })
        }).render();

        self.control.n1Input = new modelNS.Input({
            parent: self.layout.refractiveIndexParameters.$content,
            value: self.defaults.n1,
            step: self.kit.nInputs.step,
            min: 1, //self.defaults.n2 + self.kit.nInputs.step,
            max: 3, //self.kit.nInputs.max,
            inputType: 'number',
            width: 320,
            label: '<span class="italicText">n</span><sub>1</sub> = ',
            fixed: 2,
            row: true,
            title: modelNS.lang('refractiveIndexParameters1'),
        }).render();
        self.control.n2Input = new modelNS.Input({
            parent: self.layout.refractiveIndexParameters.$content,
            value: self.defaults.n2,
            step: self.kit.nInputs.step,
            min: 1, //self.kit.nInputs.min,
            max: 3, //self.defaults.n1 - self.kit.nInputs.step,
            inputType: 'number',
            width: 150,
            label: '<span class="italicText">n</span><sub>2</sub> = ',
            fixed: 2,
            row: true,
            title: modelNS.lang('refractiveIndexParameters2'),
        }).render();

        self.label.angleRefLect = new modelNS.LabelView({
            title: modelNS.lang('ReflectionAngle'),
            cls: 'labelAngle',
            text: '<span class="georgia">&beta;</span> = {%d}&deg;',
            parent: self.layout.anglesText.$content,
        }).render();

        var n1 = +self.control.n1Input.getText();
        var n2 = +self.control.n2Input.getText();

        self.label.angleRefRact = new modelNS.LabelView({
            title: modelNS.lang('RefractionAngle'),
            cls: 'labelAngle',
            text: '<span class="georgia gammaSymbol">&gamma;</span> = {%d}&deg;',
            parent: self.layout.anglesText.$content,
        }).render();

        self.label.refRactStatus = new modelNS.LabelView({
            cls: 'labelAngle',
            text: '<span class="refract-status">'+modelNS.lang('totalInternalReflectionIsObserved')+'</span>',
            parent: self.layout.anglesText.$content,
        }).render();
        
        self.label.refLectStatus = new modelNS.LabelView({
            cls: 'labelAngle',
            text: '<span class="reflect-status">{%d}</span>',
            parent: self.layout.anglesText.$content,
        }).render();

        self.label.angleFullRefLect = new modelNS.LabelView({
            title: modelNS.lang('totalInternalReflectionAngle'),
            cls: 'labelAngle',
            text: '<span class="georgia">&alpha;</span><sub>0</sub> = {%d}&deg;',
            parent: self.layout.anglesText.$content,
        }).render();

        
    },

    renderDefaults: function () {
        var self = this;
        self.func.changeAngleFullRefLect();
        self.func.changeAngleRefLect();
        self.func.changeRefLectStatus();
        self.func.changeAngleRefRactStatus();
        self.func.changeOpacityN1();
        self.func.moveLaser(self.defaults.angle);
    },

    renderListener: function () {
        var self = this;

        var eventState = { // svgClick, svgDrag, sliderSlide, sliderChange, inputChange
            source: null,
            lastSource: null,
            slideCount: 0,
        };

        function updateAngle(source, angle) {
            angle = +angle
            if (eventState.source !== null) {
                return;
            }
            eventState.source = source;
            if (eventState.source === 'sliderSlide' && eventState.lastSource === 'sliderSlide') {
                eventState.slideCount += 1;
            }

            if (['svgDrag'].indexOf(eventState.source) >= 0) {
                self.func.moveLaser(angle, true);
            } else if (eventState.source === 'sliderSlide' && eventState.slideCount === 0) {
            } else if (eventState.source === 'sliderSlide' && eventState.slideCount > 0) {
                self.func.moveLaser(angle, true);
            } else if (eventState.source === 'slideChange' && eventState.slideCount > 0) {
            } else {
                self.func.moveLaser(angle);
            }

            var angleRound = angle.toFixed(1); // Math.round(angle)

            self.control.angleInput.setText(angleRound); 
            self.control.angleSlide.setValue(angleRound);
            
            self.label.angleRefLect.set({ d: String(angleRound).replace('.',',') }); 
            
            if (eventState.source !== 'sliderSlide') {
                eventState.slideCount = 0;
            }
            eventState.lastSource = eventState.source;
            eventState.source = null;
        }

        var oldNValues = {
            n1: self.defaults.n1,
            n2: self.defaults.n2,
        };

        function updateRefRactIndex(nName) {
            var n1 = self.control.n1Input;
            var n2 = self.control.n2Input;
            var n1T = n1.getText();
            var n2T = n2.getText();
            var angle = self.control.angleInput;
            /* if (nName === 'n1') {
                n2.max = n1T - self.kit.nInputs.step;
            } else if (nName === 'n2') {
                n1.min = +n2T + self.kit.nInputs.step;
            } */
            self.func.changeAngleFullRefLect();
            self.func.changeRefLectStatus();
            self.func.changeAngleRefRactStatus();
            self.func.changeOpacityN1();
            self.func.moveLaser(angle.getText());
        }

        /* self.svg.svg.on('click', function (event) {
            var x = d3.event.x;
            var y = d3.event.y;
            self.func.angleFromCoords('svgClick', x, y, function (angle) {
                updateAngle('svgClick', angle);
            });
        }); */
        d3.select(self.canvas.$canvasLaser[0])
            .call(d3.drag()
                .on('drag', function () {
                    var x = d3.event.sourceEvent.x;
                    var y = d3.event.sourceEvent.y;
                    self.func.angleFromCoords('svgDrag', x, y, function (angle) {
                        updateAngle('svgDrag', angle);
                    });
                })
                .on('end', function () {
                }));

        self.listenTo(self.control.angleInput, 'Change', function (value) {
            updateAngle('inputChange', value);
        });
        self.listenTo(self.control.angleSlide, 'Change', function (obj) {
            updateAngle('slideChange', obj.value);
        });
        self.listenTo(self.control.angleSlide, 'Slide', function (obj) {
            updateAngle('sliderSlide', obj.value);
        });
        self.listenTo(self.control.n1Input, 'Change', function (value) {
            if (+value === +oldNValues.n1) return;
            oldNValues.n1 = +value;
            updateRefRactIndex('n1');
        });
        self.listenTo(self.control.n2Input, 'Change', function (value) {
            if (+value === +oldNValues.n2) return;
            oldNValues.n2 = +value;
            updateRefRactIndex('n2');
        });
    }
});