// Example usage of the API client

const { membersAPI, classesAPI, trainersAPI, messagesAPI } = require("./api-client")

// Example function to demonstrate API usage
async function demonstrateAPI() {
  try {
    console.log("Fetching all members...")
    const members = await membersAPI.getAll()
    console.log(`Found ${members.length} members`)

    console.log("\nFetching member details...")
    const memberDetails = await membersAPI.getById("M001")
    console.log("Member details:", memberDetails.name)

    console.log("\nCreating a new member...")
    const newMember = await membersAPI.create({
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "(555) 123-4567",
      status: "pending",
      membershipType: "Standard",
      address: "123 Main St, Anytown, USA",
      birthdate: "1990-01-01",
      emergencyContact: "Jane Doe (555) 987-6543",
      notes: "New member",
    })
    console.log("New member created:", newMember.id)

    console.log("\nUpdating member...")
    const updatedMember = await membersAPI.update(newMember.id, {
      status: "active",
      notes: "Member activated",
    })
    console.log("Member updated:", updatedMember.status)

    console.log("\nFetching all classes...")
    const classes = await classesAPI.getAll()
    console.log(`Found ${classes.length} classes`)

    console.log("\nFetching all trainers...")
    const trainers = await trainersAPI.getAll()
    console.log(`Found ${trainers.length} trainers`)

    console.log("\nFetching inbox messages...")
    const inboxMessages = await messagesAPI.getByCategory("inbox")
    console.log(`Found ${inboxMessages.length} inbox messages`)

    console.log("\nDeleting test member...")
    await membersAPI.delete(newMember.id)
    console.log("Member deleted")
  } catch (error) {
    console.error("Error during API demonstration:", error)
  }
}

// Run the demonstration
demonstrateAPI()
