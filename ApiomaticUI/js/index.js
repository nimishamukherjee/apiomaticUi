var services;
var baseURL="data/"
var ext=".json"

//function to return the type + href for methods
function fnReturnType(obj){
	for(i in obj){
		switch(obj[i]){
			case "string":
			case "int":
				return(obj[i]);
			break;
			case "array":
				for(j in obj){
					if(j=="nestedType"){
						var ref = obj[j];
						for(k in ref){
							return ("Type is an array of <a href=\"#"+ref[k]+"\">"+ref[k]+"</a>");
						}
					}
				}
				
			break;
			default:
				return("Type is <a href=\"#"+obj[i]+"\">"+ obj[i]+"</a>");
			break;
		}
		
	}
}
//Display services page
function fnDisplayService(){
	location.reload();
}
//Display api details
function fnDisplayApiDetails(url){
//Hide services
	$("#indexdisplay").addClass("hide");
	$("#apiDisplay").removeClass("hide");
	$("#apititle").append(url);
	
	var directive = {
		'td#mainurl':'urls',		
		'td#packageName':'packageName',
		'td.controllerdoc':'documentation',
		'tr.rowdoc@class':function(arg){
			return (arg.documentation =="" || arg.documentation ==undefined) ? "hide" : "";
		}
	}
	directiveMethod = {
		'tbody':{
			'method<-methods':{
				"tr td.consumes": "#{method.consumes}",
				'tr.rowconsumes@class':function(arg){
					return arg.item.consumes=="" ? "hide" : "";
				},
				'tr td.headers': "#{method.headers}",
				'tr.rowheaders@class':function(arg){
					return arg.item.headers=="" ? "hide" : "";
				},
				'tr td.produces': "#{method.produces}",
				'tr.rowproduces@class':function(arg){
					return arg.item.produces=="" ? "hide" : "";
				},			
				'tr td.urls': "#{method.urls}",
				'tr.rowurls@class':function(arg){
					return arg.item.urls=="" ? "hide" : "";
				},
				'tr td.documentation': "#{method.documentation}",
				'tr.rowdoc@class':function(arg){
					return (arg.item.documentation=="" || arg.item.documentation==undefined) ? "hide" : "";
				},
				'tr td.body' : function(arg){
					return (fnReturnType(arg.item.body))
				},
				'tr.rowbody@class':function(arg){
					return (arg.item.body=="" || arg.item.body==undefined) ? "hide" : "";
				},	
				'tr td.methods': "#{method.methods}",
				'tr.rowmethods@class':function(arg){
					return arg.item.methods=="" ? "hide" : "";
				},	
				'tr td.params': "#{method.params}",	
				'tr.rowparams@class':function(arg){
					return arg.item.params=="" ? "hide" : "";
				},	
				'tr td.response' : function(arg){
					return (fnReturnType(arg.item.response))
				},
				'tr.rowresponse@class':function(arg){
					return (arg.item.response=="" || arg.item.response==undefined) ? "hide" : "";
				}

			}
		}
	};
	directiveMD={
		'div.repdiv':{
			'method<-typeDefinitions':{
				'div.type b':"#{method.type}",
				"div.type@id":"#{method.type}",								
				'table tr td.doc':"#{method.documentation}",
				'table tr.rowdoc@class':function(arg){
					return (arg.item.documentation=="" || arg.item.documentation==undefined) ? "hide" : "";
				},
				'table tr.rowprops@class':function(arg){
					return (arg.item.properties=="" || arg.item.properties==undefined) ? "hide" : "";
				},
				'table tr.properties':{
					"property <- method.properties" : {
						"td.type": function(arg){
							switch(arg.item.type)
							{
								case "array": 
									var refObj = arg.item;
										for(j in refObj){
											if(j=="nestedType"){
												var ref = refObj[j];
												for(k in ref){
													return ("Array of <a href=\"#"+ref[k]+"\">"+ref[k]+"</a>");
												}}}			
								break;
								case "string":
								case "int":
								case "boolean":
									return (arg.item.type);
								break;
								default:
									return ("<a href=\"#"+arg.item.type+"\">"+arg.item.type+"</a>");
								break;
							}
						},
						"tr td.name+":"#{property.name}",
						"tr td.name span.required@class":function(arg){
							if(arg.item.optional==false || arg.item.optional=="false"){
								return "required";
							}else{
								return "hide";
							}
						},
						"tr td.name div.alert": function(arg){
							if(arg.item.optional==false || arg.item.optional=="false"){
								return arg.item.requiredValue;
							}else{
								return "";
							}
						 }
					}
				},
				'table tr td.subclass':function(arg){
					var str = "";
					var obj = arg.item.subclasses
					if(obj !="")
					{
						for(j in obj ){
							var ref = obj[j];
							for(k in ref){
								str += "<a href=\"#"+ref[k]+"\">"+ref[k]+"</a>, ";
							}
						}
					}				
					return str;
					//"<a href=\"#"+arg.item.type+"\">"+arg.item.type+"</a>"
				},
				'table tr.rowsub@class':function(arg){
					return (arg.item.subclasses=="") ? "hide" : "";
					
				},
				'table tr td.abstract':"#{method.abstractClass}",
				'table tr.rowabstract@class':function(arg){
					return (arg.item.abstractClass=="" || arg.item.abstractClass==undefined) ? "hide" : "";
				}
			}
		}
	};	
	var pathUrl = baseURL+url+ext;
	$.getJSON(pathUrl, function(json) {
		$('table#apiTable').render(json, directive);
		//var rfn = $('table#methodTemplate').compile( directiveMethod )		
		$('table#methodTemplate').render(json, directiveMethod);
		$('div#typeDefinition').render(json, directiveMD);		
	});
}


$(document).ready(function() {
	var directive = {
		'tbody tr':{
			'services<-services':{
				"td.name a": "#{services.name}",
				"td.baseURL": "#{services.baseUrl}",
				"td.documentation": "#{services.documentation}"
			}
		}
	};	
	var pathUrl = baseURL+"services"+ext;
	$.getJSON(pathUrl, function(json) {
		var jsObj = null;
		jsObj = {"services":json};
		$('table#services-table').render(jsObj, directive);
		//define the click function
		$('td.name a').click(function(){
			var callUrl = $(this).html();
			fnDisplayApiDetails(callUrl);
		});		
	});
	
	
});