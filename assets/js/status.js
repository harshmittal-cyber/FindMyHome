class StatusUpdate {
  constructor(statusupdate) {
    this.status = statusupdate;
    this.bidstatus();
  }

  bidstatus() {
    $(this.status).click(function (e) {
      console.log(e);
      e.preventDefault();

      let self = this;

      $.ajax({
        type: "POST",
        url: $(self).attr("href"),
      }).then(function (data) {
        let status = $(self).attr("data-status");

        if (data.bid) {
          status = "Accepted";
          $(self).attr("data-status", status);
          $(self).html(`${status}`);
        } else if (data.bids) {
          status = "Rejected";
          $(self).attr("data-status", status);
          $(self).html(`${status}`);
        }
      });
    });
  }
}
