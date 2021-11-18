let file = {};

function choosefile(e) {
  file = e.target.files[0];
}

const ref = firebase.firestore().collection('users').where("roles", "==", "staff");

function deleteItem(userId) {
    const deleteUser = functions.httpsCallable('deleteUser');
    // db.collection("cart-items").doc(itemId).delete();
        var t;
        Swal.fire({
            title: "Deleting",
            html: "Please Wait <strong></strong> seconds.",
            timer: 3500,
            confirmButtonClass: "btn long",
            buttonsStyling: !1,
            onBeforeOpen: function () {
                Swal.showLoading(),
                    (t = setInterval(function () {
                        Swal.getContent().querySelector("strong").textContent = Swal.getTimerLeft();
                    }, 100));
            },
            onClose: function () {
                clearInterval(t);
            },
        }).then(function (t) {
            t.dismiss === Swal.DismissReason.timer && console.log("I was closed by the timer");
        });
    
    deleteUser({ uid: userId })
        .then(result => {
            console.log(result);
        })
        .catch(err => {
            console.log(err.message);
        })

}


  
  function insertPicUrl(items) {
  
  
  
    //let itemsHTML = "";
    items.forEach((item) => {
  
        firebase.storage().ref('users/' + item.id + '/profile.jpg').getDownloadURL()
            .then(imgUrl => {
                db.collection("users").doc(item.id).update({
                    ImageUrl: imgUrl
  
                })
            })
  
        
  
    })
  }

  function EditStaff(UserId) {

    const Updateform = document.querySelector('#update-staff-form');
    Updateform.addEventListener('submit', (e) => {
        e.preventDefault();

        db.collection("users").doc(UserId).update({    
            Username: Updateform['user-name-editStaff'].value,
            f_name: Updateform['f-name-editStaff'].value,
            l_name: Updateform['l-name-editStaff'].value
        }).catch(err => {
            console.log;
            Updateform.querySelector('.error').innerHTML = err.message;
        });

        // link menu pic with firestore
        firebase.storage().ref('users/' + UserId + '/profile.jpg').put(file).then( function() {
            console.log('uploaded profile image')
          }).then(() => {
            
            //window.location.href = "/AdminDashboard/pages/maindashboard/menu-list.html";
            Updateform.reset();
            Updateform.querySelector('.error').innerHTML = ''
            Swal.fire({ title: "Success!", text: "Staff have been updated", allowOutsideClick: !0, confirmButtonClass: "btn long", buttonsStyling: !1 });
            run(500).then(() => { window.location.href = "/AdminDashboard/pages/apps/list/staff-list.html"; });

        }).catch(error => {
            console.log(error.message);
        })
        //////////////////////////////////////////////////////////
        function run(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
    });
}  

ref.onSnapshot(snapshot => {
    // console.log(snapshot);

    let requests = [];
    snapshot.forEach(doc => {
        requests.push({ ...doc.data(), id: doc.id });
    });
    insertPicUrl(requests);
    console.log(requests);

    let list = '';
    requests.forEach(request => {
        list +=

            ` <tr>
<td>
    <!-- Custom Checkbox -->
    <label class="custom-checkbox">
        <input type="checkbox">
        <span class="checkmark"></span>
    </label>
    <!-- End Custom Checkbox -->

</td>
<td>
    <div class="d-flex align-items-center">
        <div class="img mr-20">
        <img src="${request.ImageUrl}" class="img-40" alt="">
        </div>
        <div class="name bold">${request.Username}</div>
    </div>
</td>
<td class="email">${request.email}</td>
<td class="f_name">${request.f_name}</td>
<td class="l_name">${request.l_name}</td>
<!--<td>UX Researcher</td>
<td>June 20, 2015</td>
<td>$26253.0</td>-->
<td class="actions">
    <span class="contact-edit" data-id="${request.id}" data-toggle="modal" data-target="#contactEditModal">
        <img src="../../../assets/img/svg/c-edit.svg" alt="" class="svg">
    </span>
    <span class="contact-close">
        <img class="deleteStaff" data-id="${request.id}" src="../../../assets/img/svg/c-close.svg" alt="" class="svg">
    </span>
</td>
</tr>`

        //name += `<td>${request.Username}</td>`
        //email += `<li>${request.text}</li>`
    });
    
    document.querySelector('.list').innerHTML = list;
    createEventListeners();
    //document.querySelector('.name').innerHTML = name;
    //document.querySelector('.email').innerHTML = email;
});

function createEventListeners() {

    let deleteButtons = document.querySelectorAll(".deleteStaff");
    let EditButtons = document.querySelectorAll(".contact-edit");

    deleteButtons.forEach((button) => {
        button.addEventListener("click", function () {
            console.log("clicked");
            deleteItem(button.dataset.id)
        })
    })

    EditButtons.forEach((button) => {
        button.addEventListener("click", function () {
            console.log("clicked edit " + button.dataset.id);
            EditStaff(button.dataset.id)

        })
    })

}   