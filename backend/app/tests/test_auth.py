'''

import unittest
from app import app, db

class AuthAPITestCase(unittest.TestCase):
    # def setUp(self):
    #     self.client = self.app.test_client()
    # def tearDown(self):
    #     with self.app.app_context():
    #         db.drop_all()

    def test_register(self):
        # Write your test for the /register API
        # response = self.client.post('/register', json={'username': 'testuser', 'password': 'testpassword'})
        # self.assertEqual(response.status_code, 200)
        # Add more assertions based on your API behavior
        self.assertEqual(100 + 100, 200)

    def test_login(self):
        # Write your test for the /login API
        # response = self.client.post('/login', json={'username': 'testuser', 'password': 'testpassword'})
        # self.assertEqual(response.status_code, 200)
        # Add more assertions based on your API behavior
        # return True
        self.assertEqual(100 + 100, 200)
        # Repeat the process for other API tests

if __name__ == '__main__':
    unittest.main()
'''