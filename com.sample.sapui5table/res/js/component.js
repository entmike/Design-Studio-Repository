sap.designstudio.sdk.Component.subclass("com.sample.sapui5table.SAPUI5Table", function() {

	var that = this;
	var column1_data = null;
	var column2_data = null;
	var column3_data = null;
	var meta_data = null;
	
	var myUI5Table = null;
	var myModel = null;
	
	var concatenatedDimension = "";
	
    // Simple getter/setter
    this.rowClicked = function(value){
    	if(value===undefined) {
    		// Getter
    		return concatenatedDimension;
    	}else{
    		// Setter (fluent interface)
    		return this;
    	}
    };
    
	this.rowChanged = function(evt){
		concatenatedDimension = ""; 
		var rowContext = evt.getParameters().rowContext;
		if(rowContext){
			concatenatedDimension = myModel.getProperty(rowContext+"/headingColumn");
		}else{
			concatenatedDimension = "";
		}
		that.firePropertiesChanged(["rowClicked"]);	// SDK proxies these properties, must inform of change
		that.fireEvent("onclick");
	};
	
	this.init = function() {
		myUI5Table = new sap.ui.table.Table({
			selectionMode: sap.ui.table.SelectionMode.Single,
			rowSelectionChange : this.rowChanged
		});
	
		this.$().css("overflow-y", "scroll");
		myUI5Table.placeAt(this.$());	// Until SAP gives us an official way...
	};

	this.afterUpdate = function() {
		try{
		var tabularData = [];
		if(column1_data){
			for (var i = 0; i < column1_data.data.length; i++) {
				var newRow = {};
				var tuple = column1_data.tuples[i];
				var rowHeaderText = "";
				for (var j = 0; j < tuple.length; j++) {
					if (column1_data.selection[j] == -1) {
						rowHeaderText += " " + meta_data.dimensions[j].members[tuple[j]].text;
					}
				}
				rowHeaderText = rowHeaderText.replace("|", " "); // Delimiter used for multiple presentations
				newRow.headingColumn = rowHeaderText;
				newRow.col1 = formatValue(column1_data.data[i], column1_data.tuples[i]);
				if(column2_data) newRow.col2 = formatValue(column2_data.data[i], column2_data.tuples[i]);
				if(column3_data) newRow.col3 = formatValue(column3_data.data[i], column3_data.tuples[i]);
				tabularData.push(newRow);
			}
		}
		myUI5Table.removeAllColumns();
		if(column1_data){
			var columnHeaderText = "";
			for (var i = 0; i < column1_data.selection.length; i++) {
				var selectionIndex = column1_data.selection[i];
				if (selectionIndex != -1) columnHeaderText += " " + meta_data.dimensions[i].members[selectionIndex].text;
			}
			myUI5Table.addColumn(new sap.ui.table.Column({
				label: new sap.ui.commons.Label({text : "Concatenated Dimension"}),
				template: new sap.ui.commons.TextView().bindProperty("text", "headingColumn"),
				sortProperty: "headingColumn",
				filterProperty: "headingColumn"
			}));
			myUI5Table.addColumn(new sap.ui.table.Column({
				label: new sap.ui.commons.Label({text : columnHeaderText}),
				template: new sap.ui.commons.TextView().bindProperty("text", "col1"),
				sortProperty: "col1",
				filterProperty: "col1"
			}));
			if(column2_data){
				var columnHeaderText = "";
				for (var i = 0; i < column2_data.selection.length; i++) {
					var selectionIndex = column2_data.selection[i];
					if (selectionIndex != -1) columnHeaderText += " " + meta_data.dimensions[i].members[selectionIndex].text;
				}
				myUI5Table.addColumn(new sap.ui.table.Column({
					label: new sap.ui.commons.Label({text : columnHeaderText}),
					template: new sap.ui.commons.TextView().bindProperty("text", "col2"),
					sortProperty: "col2",
					filterProperty: "col2"
				}));
			}
			if(column3_data){
				var columnHeaderText = "";
				for (var i = 0; i < column3_data.selection.length; i++) {
					var selectionIndex = column3_data.selection[i];
					if (selectionIndex != -1) columnHeaderText += " " + meta_data.dimensions[i].members[selectionIndex].text;
				}
				myUI5Table.addColumn(new sap.ui.table.Column({
					label: new sap.ui.commons.Label({text : columnHeaderText}),
					template: new sap.ui.commons.TextView().bindProperty("text", "col3"),
					sortProperty: "col3",
					filterProperty: "col3"
				}));
			}
			myModel = new sap.ui.model.json.JSONModel();
			myModel.setData({modelData: tabularData});
			myUI5Table.setModel(myModel);
			myUI5Table.bindRows("/modelData");
			myUI5Table.setVisibleRowCount(column1_data.data.length);
		};
		
		}catch(e){
			alert(e);
		}
	};

	function formatValue(value, tuple) {
		if (value === null) {
			return "";
		}

		if (meta_data) {
			for (var i = 0; i < meta_data.dimensions.length; i++) {
				var strFormat = meta_data.dimensions[i].members[tuple[i]].formatString;
				if (strFormat) {
					// use CVOM library to format cell value
					sap.common.globalization.NumericFormatManager.setPVL(meta_data.locale);
					return sap.common.globalization.NumericFormatManager.format(value, strFormat);
				}
			}
		}
		return value;
	}

	// called from Additional Properties Sheet JavaScript file

	this.getMetadataAsString = function() {
		return JSON.stringify(this.metadata());
	};

	// property setter/getter functions

	this.column1 = function(value) {
		if (value === undefined) {
			return column1_data;
		} else {
			column1_data = value;
			return this;
		}
	};

	this.column2 = function(value) {
		if (value === undefined) {
			return column2_data;
		} else {
			column2_data = value;
			return this;
		}
	};

	this.column3 = function(value) {
		if (value === undefined) {
			return column3_data;
		} else {
			column3_data = value;
			return this;
		}
	};

	this.metadata = function(value) {
		if (value === undefined) {
			return meta_data;
		} else {
			meta_data = value;
			return this;
		}
	};
});
