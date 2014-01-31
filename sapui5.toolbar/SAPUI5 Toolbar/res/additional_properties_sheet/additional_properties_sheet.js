sap.designstudio.sdk.PropertyPage.subclass("com.ipaper.sameple.menu.ToolBarMenuPropertyPage",  function() {
	var that = this;
	this.rendered = false;
	
	// 	this.callRuntimeHandler("sampleFunction", "arg1", "arg2");
	
	this.componentSelected = function(){
		//alert("!");
	};
	this.init = function() {
		// Init
		this.rendered = true;
	};
	
	this.prop1 = function(value){
		if( value === undefined){
			return this.prop1.getValue();
		}else{
			// if(this.rendered == true) this.jsEditor.setValue(value);
			return this;
		}
	};
	
});