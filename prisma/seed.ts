import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const DEMO_PASSWORD = "campus-demo";

async function main() {
  await prisma.exchangeRequest.deleteMany();
  await prisma.listing.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);

  const owner = await prisma.user.create({
    data: {
      email: "owner@campus.edu",
      passwordHash,
      displayName: "Owner One",
    },
  });

  const seeker = await prisma.user.create({
    data: {
      email: "seeker@campus.edu",
      passwordHash,
      displayName: "Seeker One",
    },
  });

  await prisma.listing.create({
    data: {
      ownerId: owner.id,
      title: "Operating System Concepts",
      author: "Silberschatz, Galvin, Gagne",
      courseCode: "COMS 4118",
      condition: "good",
      notes: "A few highlighted chapters.",
      status: "available",
    },
  });

  await prisma.listing.create({
    data: {
      ownerId: owner.id,
      title: "Discrete Mathematics and Its Applications",
      author: "Kenneth Rosen",
      courseCode: "COMS 3203",
      condition: "like_new",
      status: "available",
    },
  });

  await prisma.listing.create({
    data: {
      ownerId: seeker.id,
      title: "Introduction to Algorithms",
      author: "Cormen, Leiserson, Rivest, Stein",
      courseCode: "COMS 3251",
      condition: "fair",
      notes: "Paperback; spine worn.",
      status: "available",
    },
  });

  const requestedPending = await prisma.listing.create({
    data: {
      ownerId: owner.id,
      title: "Computer Networks: A Systems Approach",
      author: "Peterson and Davie",
      courseCode: "CSEE 4119",
      condition: "good",
      status: "requested",
    },
  });

  const requestedAccepted = await prisma.listing.create({
    data: {
      ownerId: owner.id,
      title: "Database System Concepts",
      author: "Silberschatz, Korth, Sudarshan",
      courseCode: "COMS 4111",
      condition: "new",
      status: "requested",
    },
  });

  const exchanged = await prisma.listing.create({
    data: {
      ownerId: owner.id,
      title: "Linear Algebra and Its Applications",
      author: "David Lay",
      courseCode: "MATH 2010",
      condition: "fair",
      notes: "Already handed off last semester.",
      status: "exchanged",
    },
  });

  await prisma.exchangeRequest.create({
    data: {
      listingId: requestedPending.id,
      requesterId: seeker.id,
      pickupNote: "Butler Library lobby, Thursday 3pm",
      status: "pending",
    },
  });

  await prisma.exchangeRequest.create({
    data: {
      listingId: requestedAccepted.id,
      requesterId: seeker.id,
      pickupNote: "CS building 1st floor, after lecture",
      status: "accepted",
    },
  });

  await prisma.exchangeRequest.create({
    data: {
      listingId: exchanged.id,
      requesterId: seeker.id,
      pickupNote: "Lerner Hall, already completed",
      status: "completed",
    },
  });

  console.log("Seeded demo users:");
  console.log("  owner@campus.edu / campus-demo");
  console.log("  seeker@campus.edu / campus-demo");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
