ControllerCollection = Backbone.Collection.extend 
  urlRoot:"./data"
  url: ->
    this.urlRoot + '/' + this.controller + '.json';
      
class ListView extends Backbone.View
  @el: $("#Customerslist")
  render: ->
    $("#Customerslist").setTemplateElement("Template-List")
    $("#Customerslist").processTemplateURL("data/services.json")
                
AppRouter = Backbone.Router.extend
  routes:
    ":controller/:sublink": "subLink"
    ":controller": "showController"
    "":"list"
  subLink: (controller, subLink) ->
    id = "#" + subLink + "link"
    $(id).trigger "click"
    window.location.hash = id
    
  showController: (controller) ->
    controllerList = new ControllerCollection
    controllerList.controller = controller
    if (controller.indexOf('-') is -1)
      controllerList.fetch
        success:(models) ->
          $("#Customerdetails").setTemplateElement("Template-Details")
          $("#Customerdetails").setParam('name', controller);
          $("#Customerdetails").processTemplate(models.toJSON()[0])
        
          $(".arrow").click ->
            $(this).next().show ->
              if $(this).prev().hasClass("expand-arrow")
                $(this).prev().removeClass("expand-arrow").addClass("collapse-arrow")
              else
                $(this).prev().removeClass("collapse-arrow").addClass "expand-arrow"
              
        error: (model, response) ->
          console.log "error Message"
    else

  list: ->
    list = new ListView()
    list.render()
    
app = new AppRouter()
Backbone.history.start()
