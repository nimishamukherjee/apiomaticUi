//author: Nimisha
//Initial version: 0.0.1
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
							return ("Array of <a href=\"#"+ref[k]+"\">"+ref[k]+"</a>");
						}
					}
				}
				
			break;
			default:
				return("<a href=\"#"+obj[i]+"\">"+ obj[i]+"</a>");
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
		'td#packageName':'packageName'
	}
	directiveMethod = {
		'tbody':{
			'method<-methods':{
				"tr td.consumes": "#{method.consumes}",
				'tr td.headers': "#{method.headers}",
				'tr td.produces': "#{method.produces}",
				'tr td.urls': "#{method.urls}",
				'tr td.body' : function(arg){
					return (fnReturnType(arg.item.body))
				},
				'tr td.methods': "#{method.methods}",
				'tr td.params': "#{method.params}",				
				'tr td.response' : function(arg){
					return (fnReturnType(arg.item.response))
				}

			}
		}
	};
	
	directiveMD = {
		'tbody':{
			'method<-typeDefinitions':{
				"tr td.type": "#{method.type}",
				"tr td.type@id":"#{method.type}",
				'tr.properties':{
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
          				 "tr td.name":"#{property.name}",
						 "tr td.additional": function(arg){
							var str=""
							if(arg.item.optional!=undefined){
								str += "Optional : "+arg.item.optional+"<br /><br />";
							}
							if(arg.item.requiredValue!=undefined){
								str += "Required Value : "+"<a href=\"#"+arg.item.requiredValue+"\">"+arg.item.requiredValue+"</a>";
							}
							return str;
								
						 }
					}						
				},
				"tr td.subclasses": "#{method.subclasses}"
				}
		}
	};
	var pathUrl = baseURL+url+ext;
	$.getJSON(pathUrl, function(json) {
		$('table#apiTable').render(json, directive);
		$('table#methodTemplate').render(json, directiveMethod);
		$('table#typeDefinition').render(json, directiveMD);
	});
}


$(document).ready(function() {
	var directive = {
		'tbody tr':{
			'services<-services':{
				"td.name a": "#{services.name}",
				"td.baseURL": "#{services.baseUrl}",
				"td.documentation": "#{services.documentation}",
				"td.serviceurl": "#{services.serviceDescriptionUrl}",
				"td.class": "#{services.class}"
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
