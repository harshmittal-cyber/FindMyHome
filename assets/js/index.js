{
  //signup  via ajax
  let ownersignup = function () {
    let signup = $("#owner-signup");

    signup.submit(function (e) {
      e.preventDefault();
      $.ajax({
        method: "POST",
        url: "/owner/create",
        async: true,
        data: signup.serialize(),
        success: function (data) {
          window.location.href = "/owner/signin";
          console.log(data);
        },
        error: function (error) {
          console.log(error.responseText);
        },
      });
    });
  };

  //owner profile update ajax call
  let ownerupdate = function () {
    let update = $("#owner-update")[0];

    update.submit(function (e) {
      e.preventDefault();

      //storing the user id for passing the id in url
      let id = $('input[name="userid"]').val();
      //ajax call

      $.ajax({
        method: "POST",
        dataType: "json",
        url: `/owner/update/${id}`,
        data: update.serialize(),
        success: function (data) {
          const user = newownerupdate(data.data.owner);
          $("#owner-profile-update").html(user);
          console.log(data);
        },
        error: function (error) {
          console.log("error111", error.responseText);
        },
      });
    });
  };
  //owner form update html content
  const newownerupdate = function (user) {
    return $(`<div id="owner-profile-update">
    <img
      src="${user.avatar}"
      style="height: 100px; width: 100px"
      id="owner-image"

    />
    <p>${user.name}</p>
    <p>${user.email}</p>
    <p>${user.phone}</p>
    <p><a href="/owner/destroysession/${user._id}>">SignOut</a></p>
    <p><a href="/">Home</a></p>
    </div>
    `);
  };
  //function call of ajax
  ownersignup();
  ownerupdate();
}
