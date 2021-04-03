{
  let createproperty = function () {
    let newproperty = $("#property-form");

    newproperty.submit(function (e) {
      e.preventDefault();
      $.ajax({
        type: "post",
        url: "/property/create",
        data: newproperty.serialize(),
        success: function (data) {
          let property = newProperty(data.data.property);
          $("#property-list>ul").prepend(property);
          deleteProperty($(".delete-property", property));

          //show notiifcation on post publish
          new Noty({
            theme: "relax",
            text: "Post published successfully",
            type: "success",
            layout: "topRight",
            timeout: 1500,
          }).show();
          console.log(data);
        },
        error: function (error) {
          console.log(error.responseText);
        },
      });
    });
  };

  //show the listed properted via AJAX
  let newProperty = function (property) {
    return $(`<li style="background-color: aliceblue" id="property-${property._id}">
      <p>
        <img
          src="${property.user.avatar}"
          style="height: 50px; width: 50px; border-radius: 50px"
        />
      </p>
      <p>
        Owner:<b
          ><a href="/owner/profile/${property.user._id}">${property.user.name}</a></b
        >
      </p>
      <p>Property Details:<b> ${property.text}</b></p>
      <p>Property Place:<b> ${property.place}</b></p>
      <p>Property Price:<b> ${property.price}</b></p>
    
      <a class="delete-property" href="/property/destroy/${property._id}" style="text-decoration: none"
        >Delete</a
      >
      <br />
    
     
    </li>`);
  };

  // //delete a post via AJAX
  let deleteProperty = function (deleteproperty) {
    $(deleteproperty).click(function (e) {
      e.preventDefault();

      // $.ajax({
      //   type: "get",
      //   url: $(deleteproperty).prop("href"),
      //   success: function (data) {
      //     $(`#property-${data.data.property_id}`).remove();
      //     new Noty({
      //       theme: "relax",
      //       text: "Property Deleted Successfully",
      //       type: "Success",
      //       layout: "topRight",
      //       timeout: 1500,
      //     }).show();
      //   },
      //   error: function (error) {
      //     console.log(error.responseText);
      //   },
      // });
    });
  };
  createproperty();
}
