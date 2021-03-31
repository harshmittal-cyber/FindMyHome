{
  let createproperty = function () {
    let newproperty = $("#property-form");

    newproperty.submit(function (e) {
      e.preventDefault();
      $.ajax({
        method: "POST",
        url: "/property/create",
        data: newproperty.serialize(),
        success: function (data) {
          let property = newProperty(data.data.property);
          $("#property-list>ul").prepend(property);
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
    return $(`<li style="background-color: aliceblue" id="${property._id}">
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

  //delete a post via AJAX

  createproperty();
}
