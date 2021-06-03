(function (lib, img, cjs, ss) {
var p; // shortcut to reference prototypes
// library properties:
lib.properties = {
	width: 120,
	height: 80,
	fps: 24,
	color: "#FFFFFF",
	opacity: 1.00,
	manifest: []
};
lib.ssMetadata = [];
// symbols:
(lib.Symbol1 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});
	// Layer 1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#7C5221").s().p("AgsAtQgUgTABgaQgBgZAUgTQASgSAagBQAbABASASQAUATgBAZQABAagUATQgSATgbAAQgaAAgSgTg");
	this.shape.setTransform(18.5,13.8);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#BF792A").s().p("AnrB/IAAj9IPXAAIAAD9g");
	this.shape_1.setTransform(100.3,13.7,0.046,1.078);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#DCA15E").s().p("Anrh+IPXBkIAAA1IvXBkg");
	this.shape_2.setTransform(107.7,13.7,0.117,0.98);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#BF792A").s().p("AnrB/IAAj9IPXAAIAAD9g");
	this.shape_3.setTransform(2.3,13.7,0.046,1.078);

	this.shape_4 = new cjs.Shape();
	this.shape_4.graphics.f("rgba(166,125,76,0.2)").s().p("AnrB/IAAj9IPXAAIAAD9g");
	this.shape_4.setTransform(52.3,22.5,1,0.235);

	this.shape_5 = new cjs.Shape();
	this.shape_5.graphics.f("rgba(233,185,128,0.2)").s().p("AnrB/IAAj9IPXAAIAAD9g");
	this.shape_5.setTransform(52.3,7.7,1,0.333);

	this.shape_6 = new cjs.Shape();
	this.shape_6.graphics.f("#D99C55").s().p("AnrB/IAAj9IPXAAIAAD9g");
	this.shape_6.setTransform(52.3,13.7);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_6},{t:this.shape_5},{t:this.shape_4},{t:this.shape_3},{t:this.shape_2},{t:this.shape_1},{t:this.shape}]}).wait(1));
}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,113.5,27.5);

// stage content:
(lib.laser1 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});
	// Layer 1
	this.instance = new lib.Symbol1();
	this.instance.parent = this;
	this.instance.setTransform(60.1,40.1,1,1,0,0,0,56.8,13.8);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));
}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(63.3,66.3,113.5,27.5);

})(lib = lib||{}, images = images||{}, createjs = createjs||{}, ss = ss||{});
var lib, images, createjs, ss;