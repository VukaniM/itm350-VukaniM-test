const { v4: uuidv4 } = require('uuid'); // Import the uuid library

new Vue({
  el: '#events',

  data: {
    event: { id: '', title: '', detail: '', date: '' },
    events: []
  },

  mounted: function () {
    this.fetchEvents();
  },

  methods: {

    fetchEvents: function () {
      this.$http.get('/api/events')
        .then(response => {
          this.events = response.data;
          console.log(this.events);
        })
        .catch(err => {
          console.log(err);
        });
    },

    addEvent: function () {
      if (this.event.title.trim()) {
        this.event.id = uuidv4(); // Assign a unique ID to the event
        this.$http.post('/api/events', this.event)
          .then(response => {
            this.events.push(this.event);
            console.log('Event added!', response.data);
            // Reset the event object after adding
            this.event = { id: '', title: '', detail: '', date: '' };
          })
          .catch(err => {
            console.log(err);
          });
      }
    },

    deleteEvent: function (id) {
      if (confirm('Are you sure you want to delete this event?')) {        
        this.$http.delete('api/events/' + id)
          .then(response => {
            console.log(response.data);
            const index = this.events.findIndex(event => event.id === id);
            if (index !== -1) {
              this.events.splice(index, 1);
            }
          })
          .catch(err => {
            console.log(err);
          });
      }
    }
  }
});
