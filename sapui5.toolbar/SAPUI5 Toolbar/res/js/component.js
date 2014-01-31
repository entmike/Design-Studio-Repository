sap.ui.commons.Toolbar.extend("com.sample.menu.ToolbarMenu", {
	// SAP UI5 Metadata convenience at work - Setter and getter are created behind the scenes, including data binding and type validation 
	metadata : {		// Not to be confused with the Data Source metadata property
		properties : {
			"name" : "string", 
			"showCaptions" : {defaultValue : "X", type : "string" },
			"buttonClicked" : {defaultValue : -1, type : "int" },
			"buttonClickedTitle" : {defaultValue : "Nothing Clicked YET",  type : "string" }
		}
    },
    // SAPUI5 Renderer, we can leave it alone
    renderer : {			
		/*render : function(rm, oControl){
			alert(oControl.getProperty("buttonClickedTitle"));
		}*/
	},
	// Called by sap.designstudio.sdkui5.Handler  (sdkui5_handler.js)
	initDesignStudio : function() {
		try{
			// Make 100 setters and getters until SDK supports properties that are Arrays
			for(var i=0;i<=100;i++){
		        this.btns[i] = {};
		        for(var meta in this.autoProperties){
		        	this.btns[i][meta] = this.autoProperties[meta];
		        	var setter = "set" + meta.charAt(0).toUpperCase() + meta.slice(1) + i;	// Camel Case per SAPUI5 (e.g. setTitle0) 
		        	var getter = "get" + meta.charAt(0).toUpperCase() + meta.slice(1) + i;	// Camel Case per SAPUI5 (e.g. getTitle0)
		        	// Make setters and getters on the fly
		        	this[getter] = function(meta,i){
		        		return function(s){
		            		return this.btns[i][meta];
		        		};
		        	}(meta,i);
		        	this[setter] = function(meta,i){
		        		return function(s){
		        			this.btns[i][meta] = s;
		        			this.populateIcons();
		        		};
		        	}(meta,i);
		        }
		    }
			this.setStandalone(false);
			this.populateIcons();		
		}catch(e){
			alert(e);		// Aw snap
		}
	},
    btns : [],				// Button Storage
    autoProperties : {		// Button Properties and default values
    	title : "",
    	visible : false,
    	enabled : false,
    	icon : ""
    },
    // Override default getter for custom logic
    getButtonClickedTitle : function(){
    	if(this.getButtonClicked() < 0) return "[Nothing Clicked Yet]";
		return this.btns[this.getButtonClicked()].title;
    },
    // Override the SAPUI5 setter so that we can instruct the component to redraw some buttons
    setShowCaptions : function(v){
		this.setProperty("showCaptions",v);
		this.populateIcons();
	},
	populateIcons : function(){					// Main button redraw routine
    	this.removeAllItems();					// Blow away existing buttons
    	for(var i=0;i<this.btns.length;i++){	// Recreate all buttons
    		var b=this.btns[i];
    		var bt;
    		if(b && (b.title!=""||b.icon!="")){ 
    			if(b.title=="sep") {
    				bt = new sap.ui.commons.ToolbarSeparator(); 
    			}else{
	    			var that = this;
    				bt = new sap.ui.commons.Button({
	                    text : this.getProperty("showCaptions")?b.title:"",
	                    // lite : true,
	                    tooltip : b.title,
	                    enabled : b.enabled,
	                    visible : b.visible,
	                    icon : b.icon,
	                    press : function(j){
	                    	return function(){
	                    		that.setProperty("buttonClicked",j);
	                    		that.fireDesignStudioPropertiesChanged(["buttonClicked","buttonClickedTitle"]);	// SDK proxies these properties, must inform of change
	            				that.fireDesignStudioEvent("onclick");
	                    	};
	                    }(i)
	    			});
    			}
    			this.addItem(bt);
    		}
    	}
    }
});