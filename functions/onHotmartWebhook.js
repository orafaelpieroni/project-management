const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");

if (admin.apps.length === 0) {
  admin.initializeApp();
}

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

function calculateExpirationDate(planName, creationDate) {
  const createdDate = new Date(creationDate);
  let expirationDate = new Date(creationDate); // inicializado com a data de criação

  if (planName.includes("Mensal")) {
    expirationDate.setMonth(createdDate.getMonth() + 1);
  } else if (planName.includes("Semestral")) {
    expirationDate.setMonth(createdDate.getMonth() + 6);
  } else if (planName.includes("Anual")) {
    expirationDate.setFullYear(createdDate.getFullYear() + 1);
  } else {
    expirationDate.setMonth(createdDate.getMonth() + 1);
  }

  return expirationDate;
}

app.post("/", async (req, res) => {
  const webhook = req.body;

  // Add webhook to webhooks collection
  await admin.firestore().collection("webhooks").add(webhook);

  if (Object.keys(webhook).length === 0) {
    return res.status(400).send("O objeto de webhook não deve estar vazio.");
  }

  try {
    const db = admin.firestore();

    if (webhook.event === "PURCHASE_APPROVED") {
      //Consultando a coleção "users" pelo e-mail para obter o ID
      const userSnapshot = await db
        .collection("users")
        .where("email", "==", webhook.data.buyer.email)
        .limit(1)
        .get();

      // Verificar se encontrou o usuário
      if (userSnapshot.empty) {
        return res.status(404).send("Usuário não encontrado.");
      }

      // Pegando o ID do usuário
      const userId = userSnapshot.docs[0].id;

      // Calculando a data de renovação do plano
      const creationDate = webhook.creation_date;

      const renewalDate = calculateExpirationDate(
        webhook.data.subscription.plan.name,
        creationDate
      );

      // Definindo o objeto de assinatura
      const subscription = {
        status: "ACTIVE",
        plan: webhook.data.subscription.plan.name,
        price: webhook.data.purchase.price.value,
        purchaseDate: new Date(webhook.creation_date),
        renewalDate,
        statusDate: new Date(webhook.creation_date),
        ownerId: userId,
        ownerEmail: webhook.data.buyer.email,
      };

      await db.collection("subscriptions").add(subscription);
    } else if (webhook.event === "PURCHASE_REFUNDED") {
      //Consultando a coleção "users" pelo e-mail para obter o ID
      const userSnapshot = await db
        .collection("users")
        .where("email", "==", webhook.data.buyer.email)
        .limit(1)
        .get();

      // Verificar se encontrou o usuário
      if (userSnapshot.empty) {
        return res.status(404).send("Usuário não encontrado.");
      }

      // Pegando o ID do usuário
      const userId = userSnapshot.docs[0].id;

      // Definindo o objeto de assinatura
      const subscription = {
        status: "REFUNDED",
        statusDate: new Date(webhook.creation_date),
      };

      await db
        .collection("subscriptions")
        .doc(userId)
        .set(subscription, { merge: true });
    } else if (webhook.event === "PURCHASE_CHARGEBACK") {
      //Consultando a coleção "users" pelo e-mail para obter o ID
      const userSnapshot = await db
        .collection("users")
        .where("email", "==", webhook.data.buyer.email)
        .limit(1)
        .get();

      // Verificar se encontrou o usuário
      if (userSnapshot.empty) {
        return res.status(404).send("Usuário não encontrado.");
      }

      // Pegando o ID do usuário
      const userId = userSnapshot.docs[0].id;

      // Definindo o objeto de assinatura
      const subscription = {
        status: "chargeback",
        statusDate: new Date(webhook.creation_date),
      };

      await db
        .collection("subscriptions")
        .doc(userId)
        .set(subscription, { merge: true });
    } else if (webhook.event === "PURCHASE_CANCELED") {
      //Consultando a coleção "users" pelo e-mail para obter o ID
      const userSnapshot = await db
        .collection("users")
        .where("email", "==", webhook.data.buyer.email)
        .limit(1)
        .get();

      // Verificar se encontrou o usuário
      if (userSnapshot.empty) {
        return res.status(404).send("Usuário não encontrado.");
      }

      // Pegando o ID do usuário
      const userId = userSnapshot.docs[0].id;

      // Definindo o objeto de assinatura
      const subscription = {
        status: "DECLINED",
        statusDate: new Date(webhook.creation_date),
      };

      await db
        .collection("subscriptions")
        .doc(userId)
        .set(subscription, { merge: true });
    } else if (webhook.event === "SWITCH_PLAN") {
      //Consultando a coleção "users" pelo e-mail para obter o ID
      const userSnapshot = await db
        .collection("users")
        .where("email", "==", webhook.data.buyer.email)
        .limit(1)
        .get();

      // Verificar se encontrou o usuário
      if (userSnapshot.empty) {
        return res.status(404).send("Usuário não encontrado.");
      }

      // Pegando o ID do usuário
      const userId = userSnapshot.docs[0].id;

      const newPlan = webhook.data.plans.find((plan) => plan.current).name;
      const oldPlan = webhook.data.plans.find((plan) => !plan.current).name;

      // Definindo o objeto de assinatura
      const subscription = {
        status: webhook.data.subscription.status,
        statusDate: new Date(webhook.creation_date),
        switch_plan_date: new Date(webhook.data.switch_plan_date),
        plan: newPlan,
        oldPlan: oldPlan,
      };

      await db
        .collection("subscriptions")
        .doc(userId)
        .set(subscription, { merge: true });
    } else if (webhook.event === "SUBSCRIPTION_CANCELLATION") {
      //Consultando a coleção "users" pelo e-mail para obter o ID
      const userSnapshot = await db
        .collection("users")
        .where("email", "==", webhook.data.buyer.email)
        .limit(1)
        .get();

      // Verificar se encontrou o usuário
      if (userSnapshot.empty) {
        return res.status(404).send("Usuário não encontrado.");
      }

      // Pegando o ID do usuário
      const userId = userSnapshot.docs[0].id;

      // Definindo o objeto de assinatura
      const subscription = {
        status: "CANCELED",
        statusDate: new Date(webhook.creation_date),
      };

      await db
        .collection("subscriptions")
        .doc(userId)
        .set(subscription, { merge: true });
    } else if (webhook.event === "PURCHASE_DELAYED") {
      //Consultando a coleção "users" pelo e-mail para obter o ID
      const userSnapshot = await db
        .collection("users")
        .where("email", "==", webhook.data.buyer.email)
        .limit(1)
        .get();

      // Verificar se encontrou o usuário
      if (userSnapshot.empty) {
        return res.status(404).send("Usuário não encontrado.");
      }

      // Pegando o ID do usuário
      const userId = userSnapshot.docs[0].id;

      // Definindo o objeto de assinatura
      const subscription = {
        status: "DELAYED",
        statusDate: new Date(webhook.creation_date),
      };

      await db
        .collection("subscriptions")
        .doc(userId)
        .set(subscription, { merge: true });
    }

    return res.status(201).send("Webhook processado com sucesso!");
  } catch (error) {
    console.log(`Erro ao processar o webhook com o ID: ${webhook.id} `, error);
    return res.status(500).send("Erro interno ao processar o webhook.");
  }
});

exports.onHotmartWebhook = functions.https.onRequest(app);
